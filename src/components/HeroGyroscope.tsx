import { useEffect, useRef } from 'react'

/** Node body / highlight — shared with gyro ring strokes */
const NODE_CORE = '198, 208, 232'
const NODE_CENTER = '236, 240, 248'
const NODE_ACCENT = '59, 95, 255'

/** Tunables — single-pass hero scene: still → spin ramp → ring organize → hold */
const CONFIG = {
  nodeCount: 330,
  /** Wall-clock seconds skipped — frame 0 matches the old motion at t = skip */
  animationTimelineSkipSeconds: 5,
  /** Seconds: scattered field almost still before core motion (0 = ramp begins at navigation time) */
  stillDuration: 0,
  /** Seconds: gyro ω eases from idle to max (longer = gentler acceleration) */
  rampDuration: 10.5,
  /** After still ends, delay before ring visibly pulls in (longer = more scatter time) */
  organizeLag: 0.2,
  /** Multiplier on ramp duration for organize time denominator */
  organizeSpan: 0.94,
  /** >1 stretches how long nodes take to reach full structure (disorganized phase longer) */
  organizeTimeStretch: 1.52,
  /** Seconds since navigation: post-peak deceleration begins */
  stabilizeDecelAtElapsedSeconds: 11,
  /** With spin at max, minimum formation so decel isn’t premature */
  stabilizeDecelMinOrganizeMix: 0.82,
  /** Twin connections begin this many seconds before `stabilizeDecelAtElapsedSeconds` (same spin/organize gates). */
  twinConnectionLeadSeconds: 1,
  /** rad/s at start (barely perceptible) */
  idleOmega: 0.016,
  /** Multiplier on ω right after motion begins; fades to 1× by `coreEarlyBoostSpan` spinNorm */
  coreEarlyBoostMax: 2,
  /** spinNorm (0–1) over which core early boost eases from max → 1× */
  coreEarlyBoostSpan: 0.4,
  /** rad/s plateau after ramp */
  omegaMax: 8.12,
  /** After ramp + organized: hold peak ω (s) before decel — lower = earlier first drop */
  postPeakHoldSeconds: 0,
  /** Single deceleration: duration to ease ω multiplier from 1× → postPeakTargetOmegaMult */
  postPeakStepDownSeconds: 1.5,
  /** Final ω multiplier after post-peak decel (was 0.6× then 0.85×; now one step to this) */
  postPeakTargetOmegaMult: 0.51,
  /**
   * After twin phase begins: multiply ω and twin pulse clock (0.3 = 70% slower vs pre-twin).
   * Same factor keeps ring/core rotation and connection “signal” speed aligned.
   */
  twinPhaseRotationSpeedMult: 0.3,
  /** Twin “correlated pair” pulses (after final ω only) */
  twinPulseMinSeconds: 0.88,
  twinPulseMaxSeconds: 1.45,
  /** Each stream schedules its own next spawn — desynchronized, overlapping life cycles */
  twinSpawnStreamCount: 7,
  twinSpawnMinSeconds: 0.22,
  twinSpawnMaxSeconds: 1.35,
  twinMaxConcurrent: 8,
  twinLineAlphaPeak: 0.42,
  twinLineWidth: 1.25,
  twinNodeGlowBoost: 0.42,
  twinNodeCoreBoost: 0.22,
  /** Directional “signal” band length as fraction of chord (0–1) */
  twinSignalHeadFraction: 0.16,
  /** Slightly thinner than base twin line */
  twinSignalHeadWidthMul: 0.72,
  /** Fraction of pulse duration used for head to reach receiver (higher = slower, calmer travel) */
  twinSignalTravelSpan: 0.92,
  /** Node ring radius vs min(canvas) */
  ringRadiusFactor: 0.324,
  scatterInnerR: 0.088,
  scatterOuterR: 0.5,
  pulseAmpStill: 0.03,
  /** Base finale pulse; extra boost applied when fully organized */
  pulseAmpFinale: 0.48,
  /** Additional pulse amplitude when ring is fully formed */
  pulseAmpOrganizedBoost: 0.38,
  pulseBaseFreq: 1.25,
  /** Finale: px-scale jitter on ring */
  jitterAmp: 5.5,
  jitterFreq: 0.62,
  /** Two equal core rings — shared ellipse axes (fraction of minDim) */
  gyroRx: 0.092,
  gyroRyFactor: 0.38,
  /** Thicker strokes for core rings */
  gyroLineWidth: 7.95,
  /** Gimbal: whole ring precession in the canvas plane (per-axis rate vs omega) */
  gimbalMults: [1, -1.22] as const,
  /** Hoop spin: phase runs around the ellipse (material spins on the ring) */
  hoopSpinMults: [1.62, -1.14] as const,
  /** Fake-3D tumble: breathe rx/ry from spin phase (different axis feel per ring) */
  tumbleAmp: 0.125,
  tumblePhaseSkew: [1.05, 0.88] as const,
  /** Visual size tiers: smallest + medium only (no large tier) */
  nodeSizeMults: [0.7, 1] as const,
  /** Entire node ring rotation vs gyro omega once organized (higher = faster orbit) */
  nodeRingSpinMult: 0.352,
  /** Neural “connection” strobe — frequency & sharpness (higher exponent = more flash-like) */
  neuralFlashFreq: 4.6,
  neuralFlashSharp: 4.2,
  /** Tight accent halo — smaller = crisper dots, less “fuzz” */
  nodeGlowRadiusMul: 1.06,
  nodeGlowAlphaPeak: 0.026,
  /** Solid core strength */
  nodeCoreAlpha: 0.92,
  nodeCenterAlpha: 0.98,
} as const

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t))
}

function smoothstep(t: number) {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

function easeOutCubic(t: number) {
  const x = clamp01(t)
  return 1 - (1 - x) ** 3
}

/** Slow start — used for spin ramp so ω climbs gradually right after still phase */
function easeInCubic(t: number) {
  const x = clamp01(t)
  return x * x * x
}

function easeInOutCubic(t: number) {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2
}

/** dt = seconds since phase anchor; returns multiplier on omegaMax (one decel to final speed) */
function postPeakOmegaMultiplier(dt: number) {
  const hold = CONFIG.postPeakHoldSeconds
  const step = CONFIG.postPeakStepDownSeconds
  const target = CONFIG.postPeakTargetOmegaMult

  const t1 = hold
  const t2 = t1 + step

  if (dt < t1) return 1
  if (dt < t2) {
    const u = (dt - t1) / step
    return 1 + (target - 1) * easeOutCubic(u)
  }
  return target
}

/** Smooth 0→1→0 bell over pulse duration (no hard edges) */
function twinPulseEnvelope(t: number, dur: number): number {
  if (t <= 0 || t >= dur) return 0
  return Math.sin((Math.PI * t) / dur)
}

/** `dir`: 0 = signal i → opposite node; 1 = opposite → i */
type TwinPulse = { i: number; t0: number; dur: number; dir: 0 | 1 }

type SizeTier = 0 | 1

type Particle = {
  scatterX: number
  scatterY: number
  slotAngle: number
  radJitterAmp: number
  angJitterAmp: number
  phase: number
  pulseSpeed: number
  sizeTier: SizeTier
}

function buildNodes(cx: number, cy: number, w: number, h: number): Particle[] {
  const minDim = Math.min(w, h)
  const rInner = minDim * CONFIG.scatterInnerR
  const rOuter = minDim * CONFIG.scatterOuterR
  const count = CONFIG.nodeCount
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const rr = rInner + Math.random() * (rOuter - rInner)
    const sizeTier = (Math.random() < 0.5 ? 0 : 1) as SizeTier
    return {
      scatterX: cx + Math.cos(angle) * rr,
      scatterY: cy + Math.sin(angle) * rr,
      slotAngle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35,
      radJitterAmp: minDim * (0.01 + Math.random() * 0.018),
      angJitterAmp: 0.035 + Math.random() * 0.07,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.72 + Math.random() * 0.95,
      sizeTier,
    }
  })
}

/**
 * Draw one gyro ring: `gimbalRad` tilts the ellipse in the plane (axis precession);
 * `spinAlongHoopRad` advances the parametric angle so the hoop “spins” on itself.
 */
function drawGyroRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  gimbalRad: number,
  spinAlongHoopRad: number,
  rgba: string,
  lineWidth: number,
) {
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  const steps = 80
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 + spinAlongHoopRad
    const px = rx * Math.cos(t)
    const py = ry * Math.sin(t)
    const x = cx + px * Math.cos(gimbalRad) - py * Math.sin(gimbalRad)
    const y = cy + px * Math.sin(gimbalRad) + py * Math.cos(gimbalRad)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.strokeStyle = rgba
  ctx.lineWidth = lineWidth
  ctx.stroke()
  ctx.restore()
}

export function HeroGyroscope({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  /** Gimbal / precession angle in the plane */
  const gimbalAnglesRef = useRef([0.25, 1.35])
  /** Phase drift around the hoop — reads as spin about the ring’s local axis */
  const hoopSpinRef = useRef([0.5, 2.15])
  /** Collective rotation of the organized node ring */
  const nodeRingSpinRef = useRef(0)
  const animRef = useRef(0)
  const lastFrameRef = useRef<number | null>(null)
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /** Elapsed (s) when post-peak stabilizing deceleration begins */
    let phaseAnchorElapsed: number | null = null
    let twinFires: TwinPulse[] = []
    /** Absolute elapsed time per independent spawn stream (each connection has its own rhythm) */
    let twinSpawnNext: number[] = []

    const resetTwinSpawnStreams = (elapsed: number) => {
      twinSpawnNext = Array.from({ length: CONFIG.twinSpawnStreamCount }, () => {
        const gap =
          CONFIG.twinSpawnMinSeconds +
          Math.random() * (CONFIG.twinSpawnMaxSeconds - CONFIG.twinSpawnMinSeconds)
        return elapsed + gap * (0.15 + Math.random() * 0.85)
      })
    }

    const layout = () => {
      const rect = canvas.getBoundingClientRect()
      const cssW = Math.max(1, rect.width)
      const cssH = Math.max(1, rect.height)
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cx = cssW * 0.5
      const cy = cssH * 0.5
      particlesRef.current = buildNodes(cx, cy, cssW, cssH)
      twinFires = []
      const elapsedNow = performance.now() / 1000
      resetTwinSpawnStreams(elapsedNow + CONFIG.animationTimelineSkipSeconds)
      return { cssW, cssH, cx, cy }
    }

    layout()

    const onResize = () => {
      layout()
    }
    window.addEventListener('resize', onResize)

    const draw = (time: number) => {
      const last = lastFrameRef.current ?? time
      const dt = Math.min(0.05, (time - last) / 1000)
      lastFrameRef.current = time

      const w = canvas.width / dpr
      const h = canvas.height / dpr
      const cx = w * 0.5
      const cy = h * 0.5

      const wallElapsed = time / 1000
      const animT = wallElapsed + CONFIG.animationTimelineSkipSeconds

      const afterStill = Math.max(0, animT - CONFIG.stillDuration)
      const spinNorm = easeInCubic(Math.min(1, afterStill / CONFIG.rampDuration))

      const organizeDenom =
        CONFIG.rampDuration * CONFIG.organizeSpan * CONFIG.organizeTimeStretch
      const organizeT = clamp01((afterStill - CONFIG.organizeLag) / organizeDenom)
      const organizeMix = smoothstep(organizeT) * smoothstep(spinNorm * 0.92 + 0.08)

      if (
        phaseAnchorElapsed === null &&
        animT >= CONFIG.stabilizeDecelAtElapsedSeconds &&
        spinNorm >= 0.999 &&
        organizeMix >= CONFIG.stabilizeDecelMinOrganizeMix
      ) {
        phaseAnchorElapsed = animT
      }

      const omegaRampBase =
        CONFIG.idleOmega + spinNorm * (CONFIG.omegaMax - CONFIG.idleOmega)
      const earlyT = clamp01(spinNorm / CONFIG.coreEarlyBoostSpan)
      const coreEarlyBoost =
        1 + (CONFIG.coreEarlyBoostMax - 1) * (1 - smoothstep(earlyT))
      const omega =
        phaseAnchorElapsed !== null
          ? CONFIG.omegaMax *
            postPeakOmegaMultiplier(animT - phaseAnchorElapsed) *
            CONFIG.twinPhaseRotationSpeedMult
          : omegaRampBase * coreEarlyBoost

      const atTwinConnectionPhase =
        animT >=
          CONFIG.stabilizeDecelAtElapsedSeconds -
            CONFIG.twinConnectionLeadSeconds &&
        spinNorm >= 0.999 &&
        organizeMix >= CONFIG.stabilizeDecelMinOrganizeMix
      const twinPulseTimeScale =
        phaseAnchorElapsed !== null ? CONFIG.twinPhaseRotationSpeedMult : 1
      const twinPulseWallScale = 1 / CONFIG.twinPhaseRotationSpeedMult
      const useTwinSlowPulse = phaseAnchorElapsed !== null

      if (!atTwinConnectionPhase) {
        twinFires = []
        resetTwinSpawnStreams(animT)
      } else {
        twinFires = twinFires.filter(
          (f) =>
            animT <
            f.t0 + f.dur * (useTwinSlowPulse ? twinPulseWallScale : 1),
        )
        const half = CONFIG.nodeCount / 2
        const taken = new Set(twinFires.map((f) => f.i))
        for (let s = 0; s < twinSpawnNext.length; s++) {
          if (animT < twinSpawnNext[s]) continue
          if (twinFires.length >= CONFIG.twinMaxConcurrent) {
            twinSpawnNext[s] = animT + 0.03 + Math.random() * 0.09
            continue
          }
          let idx = -1
          for (let attempt = 0; attempt < 18; attempt++) {
            const cand = Math.floor(Math.random() * half)
            if (!taken.has(cand)) {
              idx = cand
              break
            }
          }
          if (idx < 0) {
            twinSpawnNext[s] = animT + 0.06 + Math.random() * 0.14
            continue
          }
          taken.add(idx)
          twinFires.push({
            i: idx,
            t0: animT,
            dur:
              CONFIG.twinPulseMinSeconds +
              Math.random() *
                (CONFIG.twinPulseMaxSeconds - CONFIG.twinPulseMinSeconds),
            dir: (Math.random() < 0.5 ? 0 : 1) as 0 | 1,
          })
          const gap =
            (CONFIG.twinSpawnMinSeconds +
              Math.random() *
                (CONFIG.twinSpawnMaxSeconds - CONFIG.twinSpawnMinSeconds)) *
            (useTwinSlowPulse ? twinPulseWallScale : 1)
          twinSpawnNext[s] = animT + gap
        }
      }

      const gimbal = gimbalAnglesRef.current
      const hoop = hoopSpinRef.current
      gimbal[0] += omega * CONFIG.gimbalMults[0] * dt
      gimbal[1] += omega * CONFIG.gimbalMults[1] * dt
      hoop[0] += omega * CONFIG.hoopSpinMults[0] * dt
      hoop[1] += omega * CONFIG.hoopSpinMults[1] * dt

      const minDim = Math.min(w, h)
      const ringSpinDrive = Math.max(organizeMix, spinNorm)
      nodeRingSpinRef.current += omega * CONFIG.nodeRingSpinMult * dt * ringSpinDrive

      const ringR = minDim * CONFIG.ringRadiusFactor

      const organizedAmount = smoothstep((organizeMix - 0.55) / 0.45)
      const pulseAmp =
        CONFIG.pulseAmpStill +
        organizeMix * (CONFIG.pulseAmpFinale - CONFIG.pulseAmpStill) +
        organizedAmount * CONFIG.pulseAmpOrganizedBoost

      const idleDrift = (1 - organizeMix * 0.85) * minDim * 0.0028

      ctx.clearRect(0, 0, w, h)

      const mixPos = smoothstep(organizeMix)
      const particles = particlesRef.current
      const n = particles.length
      const halfN = n / 2

      const xs = new Float32Array(n)
      const ys = new Float32Array(n)
      const rs = new Float32Array(n)
      const alphaCores = new Float32Array(n)
      const flashAlphas = new Float32Array(n)
      const neuralSpikes = new Float32Array(n)

      for (let idx = 0; idx < n; idx++) {
        const p = particles[idx]
        const sizeMul = CONFIG.nodeSizeMults[p.sizeTier]

        const idleX =
          Math.sin(animT * 0.38 + p.phase) * idleDrift +
          Math.cos(animT * 0.25 + p.phase * 1.2) * idleDrift * 0.65
        const idleY =
          Math.cos(animT * 0.33 + p.phase * 0.85) * idleDrift +
          Math.sin(animT * 0.21 + p.phase) * idleDrift * 0.48
        const sx = p.scatterX + idleX
        const sy = p.scatterY + idleY

        const jr =
          organizeMix *
          CONFIG.jitterAmp *
          Math.sin(animT * CONFIG.jitterFreq * p.pulseSpeed + p.phase)
        const ja =
          organizeMix *
          p.angJitterAmp *
          Math.sin(animT * 0.52 * p.pulseSpeed + p.phase * 1.65)

        const theta = p.slotAngle + ja + nodeRingSpinRef.current
        const radial =
          ringR +
          p.radJitterAmp * Math.sin(animT * 0.78 + p.phase) * organizeMix +
          jr
        const tx = cx + Math.cos(theta) * radial
        const ty = cy + Math.sin(theta) * radial

        const x = sx + (tx - sx) * mixPos
        const y = sy + (ty - sy) * mixPos

        const pulse =
          Math.sin(animT * CONFIG.pulseBaseFreq * p.pulseSpeed + p.phase) * 0.5 + 0.5
        const pulseScale = 1 + pulse * pulseAmp

        const nfT = animT * CONFIG.neuralFlashFreq + p.phase * 1.7
        const neuralWave = (Math.sin(nfT) + 1) / 2
        const neuralSpike =
          organizedAmount * neuralWave ** CONFIG.neuralFlashSharp
        const flashScale = 1 + neuralSpike * 0.28
        const flashAlpha = 1 + neuralSpike * 0.95

        const r =
          (1.35 + organizeMix * 0.95) * sizeMul * pulseScale * flashScale

        const alphaBase =
          0.22 + organizeMix * 0.28 + pulse * pulseAmp * 0.2
        const alphaCore = Math.min(1, alphaBase * flashAlpha)

        xs[idx] = x
        ys[idx] = y
        rs[idx] = r
        alphaCores[idx] = alphaCore
        flashAlphas[idx] = flashAlpha
        neuralSpikes[idx] = neuralSpike
      }

      const twinBoost = new Float32Array(n)
      if (atTwinConnectionPhase) {
        for (const f of twinFires) {
          const env = twinPulseEnvelope(
            (animT - f.t0) * twinPulseTimeScale,
            f.dur,
          )
          if (env <= 0) continue
          const i = f.i
          const j = i + halfN
          twinBoost[i] = Math.max(twinBoost[i], env)
          twinBoost[j] = Math.max(twinBoost[j], env)
        }
      }

      for (let idx = 0; idx < n; idx++) {
        const x = xs[idx]
        const y = ys[idx]
        let r = rs[idx]
        let alphaCore = alphaCores[idx]
        const flashAlpha = flashAlphas[idx]
        const neuralSpike = neuralSpikes[idx]
        const tb = twinBoost[idx]

        if (tb > 0) {
          r *= 1 + tb * CONFIG.twinNodeGlowBoost * 0.45
          alphaCore = Math.min(1, alphaCore * (1 + tb * CONFIG.twinNodeCoreBoost))
        }

        const glowSize = r * CONFIG.nodeGlowRadiusMul
        const g = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
        g.addColorStop(
          0,
          `rgba(${NODE_ACCENT}, ${CONFIG.nodeGlowAlphaPeak * alphaCore * (1 + tb * 0.45)})`,
        )
        g.addColorStop(0.4, `rgba(${NODE_ACCENT}, ${0.014 * alphaCore})`)
        g.addColorStop(1, `rgba(${NODE_ACCENT}, 0)`)
        ctx.beginPath()
        ctx.arc(x, y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        const body = ctx.createRadialGradient(x, y, 0, x, y, r)
        body.addColorStop(
          0,
          `rgba(${NODE_CENTER}, ${CONFIG.nodeCenterAlpha * alphaCore})`,
        )
        body.addColorStop(0.58, `rgba(${NODE_CORE}, ${CONFIG.nodeCoreAlpha * alphaCore})`)
        body.addColorStop(
          1,
          `rgba(${NODE_CORE}, ${CONFIG.nodeCoreAlpha * 0.86 * alphaCore})`,
        )
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = body
        ctx.fill()

        if (organizedAmount > 0.25 && neuralSpike > 0.18) {
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${NODE_ACCENT}, ${0.26 * neuralSpike * flashAlpha})`
          ctx.lineWidth = 0.65
          ctx.stroke()
        }
      }

      const rxBase = minDim * CONFIG.gyroRx
      const ryBase = rxBase * CONFIG.gyroRyFactor
      const lw = CONFIG.gyroLineWidth
      const ringStroke = `rgba(${NODE_CORE}, 0.76)`

      for (let ri = 0; ri < 2; ri++) {
        const skew = CONFIG.tumblePhaseSkew[ri]
        const tum = hoop[ri] * skew
        const rx = rxBase * (1 + CONFIG.tumbleAmp * Math.sin(tum))
        const ry = ryBase * (1 + CONFIG.tumbleAmp * Math.cos(tum * 0.93))
        const gimbalOffset = ri === 1 ? 1.05 : 0
        drawGyroRing(
          ctx,
          cx,
          cy,
          rx,
          ry,
          gimbal[ri] + gimbalOffset,
          hoop[ri],
          ringStroke,
          lw,
        )
      }

      if (atTwinConnectionPhase && twinFires.length > 0) {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (const f of twinFires) {
          const env = twinPulseEnvelope(
            (animT - f.t0) * twinPulseTimeScale,
            f.dur,
          )
          if (env <= 0) continue
          const i = f.i
          const j = i + halfN
          const ax = xs[i]
          const ay = ys[i]
          const bx = xs[j]
          const by = ys[j]
          const sx0 = f.dir === 0 ? ax : bx
          const sy0 = f.dir === 0 ? ay : by
          const sx1 = f.dir === 0 ? bx : ax
          const sy1 = f.dir === 0 ? by : ay

          const peakA = CONFIG.twinLineAlphaPeak * env
          const tRel = (animT - f.t0) * twinPulseTimeScale
          const u = clamp01(tRel / f.dur)
          const uTravel = clamp01(u / CONFIG.twinSignalTravelSpan)
          const prog = easeInOutCubic(uTravel)

          const baseGrad = ctx.createLinearGradient(sx0, sy0, sx1, sy1)
          baseGrad.addColorStop(0, `rgba(${NODE_CORE}, ${peakA * 0.92})`)
          baseGrad.addColorStop(0.38, `rgba(${NODE_CORE}, ${peakA * 0.38})`)
          baseGrad.addColorStop(1, `rgba(${NODE_CORE}, ${peakA * 0.1})`)
          ctx.strokeStyle = baseGrad
          ctx.lineWidth = CONFIG.twinLineWidth
          ctx.globalAlpha = 1
          ctx.beginPath()
          ctx.moveTo(sx0, sy0)
          ctx.lineTo(sx1, sy1)
          ctx.stroke()

          const headLen = CONFIG.twinSignalHeadFraction
          const tail = Math.max(0, prog - headLen)
          const hx0 = sx0 + (sx1 - sx0) * tail
          const hy0 = sy0 + (sy1 - sy0) * tail
          const hx1 = sx0 + (sx1 - sx0) * prog
          const hy1 = sy0 + (sy1 - sy0) * prog
          const headA = peakA * (0.94 + 0.06 * Math.sin(Math.PI * u))
          ctx.strokeStyle = `rgba(${NODE_CORE}, ${headA})`
          ctx.lineWidth = CONFIG.twinLineWidth * CONFIG.twinSignalHeadWidthMul
          ctx.beginPath()
          ctx.moveTo(hx0, hy0)
          ctx.lineTo(hx1, hy1)
          ctx.stroke()
        }
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [dpr])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
