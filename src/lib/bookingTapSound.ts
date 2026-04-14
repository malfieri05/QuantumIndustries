let sharedCtx: AudioContext | null = null

/** Lazily built from the forward tap — true time-reversal of the same waveform. */
let reversedTapBufferPromise: Promise<AudioBuffer> | null = null

/** Lazily built from {@link scheduleChatOpenTap} — true time-reversal for panel close. */
let reversedChatOpenBufferPromise: Promise<AudioBuffer> | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  if (!sharedCtx) sharedCtx = new Ctx({ latencyHint: 'interactive' })
  return sharedCtx
}

/** Schedules the forward “book” tap on any `BaseAudioContext` at `t0` (seconds). */
function scheduleForwardTap(ctx: BaseAudioContext, out: AudioNode, t0: number): void {
  const master = ctx.createGain()
  master.connect(out)

  const peak = 0.085
  master.gain.setValueAtTime(0.0001, t0)
  master.gain.linearRampToValueAtTime(peak, t0 + 0.005)
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09)

  const body = ctx.createOscillator()
  body.type = 'sine'
  body.frequency.setValueAtTime(784, t0)
  body.connect(master)
  body.start(t0)
  body.stop(t0 + 0.095)

  const air = ctx.createOscillator()
  air.type = 'sine'
  const airGain = ctx.createGain()
  airGain.gain.value = 0.028
  air.frequency.setValueAtTime(1568, t0 + 0.002)
  air.connect(airGain)
  airGain.connect(master)
  air.start(t0 + 0.002)
  air.stop(t0 + 0.055)
}

/**
 * Minimal UI acknowledgment — short soft sine with quick decay (quiet, “system” feel).
 */
export function playBookingTapSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    void ctx.resume()
    scheduleForwardTap(ctx, ctx.destination, ctx.currentTime)
  } catch {
    /* blocked or unsupported */
  }
}

function reverseMonoChannel(data: Float32Array): void {
  for (let i = 0, j = data.length - 1; i < j; i++, j--) {
    const t = data[i]!
    data[i] = data[j]!
    data[j] = t
  }
}

async function getReversedTapBuffer(ctx: AudioContext): Promise<AudioBuffer> {
  if (!reversedTapBufferPromise) {
    reversedTapBufferPromise = (async () => {
      const captureSeconds = 0.12
      const sr = ctx.sampleRate
      const frames = Math.ceil(captureSeconds * sr)
      const offline = new OfflineAudioContext(1, frames, sr)
      scheduleForwardTap(offline, offline.destination, 0)
      const rendered = await offline.startRendering()
      const ch = new Float32Array(rendered.getChannelData(0))
      reverseMonoChannel(ch)
      const out = ctx.createBuffer(1, ch.length, sr)
      out.copyToChannel(ch, 0)
      return out
    })()
  }
  return reversedTapBufferPromise
}

/**
 * Time-reversed version of {@link playBookingTapSound} — for “back” navigation.
 */
export function playBookingTapSoundReverse(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  void (async () => {
    try {
      await ctx.resume()
      const buffer = await getReversedTapBuffer(ctx)
      const src = ctx.createBufferSource()
      src.buffer = buffer
      src.connect(ctx.destination)
      src.start()
    } catch {
      /* blocked or unsupported */
    }
  })()
}

function scheduleChatOpenTap(ctx: BaseAudioContext, out: AudioNode, t0: number): void {
  const master = ctx.createGain()
  master.connect(out)

  const peak = 0.072
  master.gain.setValueAtTime(0.0001, t0)
  master.gain.linearRampToValueAtTime(peak, t0 + 0.004)
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.088)

  const body = ctx.createOscillator()
  body.type = 'sine'
  body.frequency.setValueAtTime(620, t0)
  body.frequency.exponentialRampToValueAtTime(990, t0 + 0.042)
  body.connect(master)
  body.start(t0)
  body.stop(t0 + 0.095)

  const air = ctx.createOscillator()
  air.type = 'sine'
  const airGain = ctx.createGain()
  airGain.gain.value = 0.024
  air.frequency.setValueAtTime(1240, t0 + 0.006)
  air.connect(airGain)
  airGain.connect(master)
  air.start(t0 + 0.006)
  air.stop(t0 + 0.052)
}

/**
 * Soft “panel opening” chime — same family as the booking tap (sine, short decay), slightly brighter rise.
 */
export function playChatOpenSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    void ctx.resume()
    scheduleChatOpenTap(ctx, ctx.destination, ctx.currentTime)
  } catch {
    /* blocked or unsupported */
  }
}

async function getReversedChatOpenBuffer(ctx: AudioContext): Promise<AudioBuffer> {
  if (!reversedChatOpenBufferPromise) {
    reversedChatOpenBufferPromise = (async () => {
      const captureSeconds = 0.12
      const sr = ctx.sampleRate
      const frames = Math.ceil(captureSeconds * sr)
      const offline = new OfflineAudioContext(1, frames, sr)
      scheduleChatOpenTap(offline, offline.destination, 0)
      const rendered = await offline.startRendering()
      const ch = new Float32Array(rendered.getChannelData(0))
      reverseMonoChannel(ch)
      const out = ctx.createBuffer(1, ch.length, sr)
      out.copyToChannel(ch, 0)
      return out
    })()
  }
  return reversedChatOpenBufferPromise
}

/**
 * Time-reversed {@link playChatOpenSound} — play when the chat panel closes.
 */
export function playChatCloseSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  void (async () => {
    try {
      await ctx.resume()
      const buffer = await getReversedChatOpenBuffer(ctx)
      const src = ctx.createBufferSource()
      src.buffer = buffer
      src.connect(ctx.destination)
      src.start()
    } catch {
      /* blocked or unsupported */
    }
  })()
}
