import { Resend } from 'resend'
import OpenAI from 'openai'
import { site } from '../content/site.js'
import { readEnvSecret } from './envUtils.js'

const RATE_WINDOW_MS = 60_000
const MAX_PER_WINDOW = 3
/** 4 MB decoded audio — ~16 kbps × 20 min with some headroom */
const MAX_AUDIO_BYTES = 4 * 1024 * 1024

const buckets = new Map<string, { count: number; resetAt: number }>()

function rateLimitOk(ip: string): boolean {
  const now = Date.now()
  const b = buckets.get(ip)
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (b.count >= MAX_PER_WINDOW) return false
  b.count += 1
  return true
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sitePublicBase(): string {
  const fromEnv = process.env.SITE_PUBLIC_URL?.trim().replace(/\/$/, '')
  return fromEnv || site.publicUrl
}

function audioFilename(mimeType: string): string {
  if (mimeType.includes('mp4') || mimeType.includes('m4a')) return 'voice-recording.mp4'
  if (mimeType.includes('ogg')) return 'voice-recording.ogg'
  return 'voice-recording.webm'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type AudioConsultationResult =
  | { ok: true }
  | { ok: false; status: number; error: string }

const BASIC_LABELS: Array<{ id: string; label: string }> = [
  { id: 'companyName', label: 'Company' },
  { id: 'website', label: 'Website' },
  { id: 'industry', label: 'Industry' },
  { id: 'locations', label: 'Locations / markets' },
  { id: 'companySize', label: 'Company size' },
  { id: 'yourRole', label: 'Role' },
  { id: 'contactPhone', label: 'Phone' },
  { id: 'preferredComm', label: 'Preferred communication' },
]

export async function handleConsultationAudioRequest(
  body: unknown,
  clientIp: string,
): Promise<AudioConsultationResult> {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, status: 400, error: 'Invalid request body.' }
  }

  const o = body as Record<string, unknown>

  if (typeof o.honeypot === 'string' && o.honeypot.trim() !== '') {
    return { ok: true }
  }

  if (!rateLimitOk(clientIp)) {
    return { ok: false, status: 429, error: 'Too many submissions. Please wait a minute.' }
  }

  const contactName = typeof o.contactName === 'string' ? o.contactName.trim() : ''
  const contactEmail = typeof o.contactEmail === 'string' ? o.contactEmail.trim() : ''
  const audioBase64 = typeof o.audioBase64 === 'string' ? o.audioBase64 : ''
  const mimeType = typeof o.mimeType === 'string' ? o.mimeType : 'audio/webm'
  const answers =
    typeof o.answers === 'object' && o.answers !== null
      ? (o.answers as Record<string, string>)
      : {}

  if (!contactName) {
    return { ok: false, status: 400, error: 'Name is required.' }
  }
  if (!contactEmail || !EMAIL_RE.test(contactEmail)) {
    return { ok: false, status: 400, error: 'A valid email address is required.' }
  }
  if (!audioBase64) {
    return { ok: false, status: 400, error: 'No audio recording received.' }
  }

  let audioBuffer: Buffer
  try {
    audioBuffer = Buffer.from(audioBase64, 'base64')
  } catch {
    return { ok: false, status: 400, error: 'Audio data could not be decoded.' }
  }

  if (audioBuffer.byteLength > MAX_AUDIO_BYTES) {
    return {
      ok: false,
      status: 413,
      error: 'Recording exceeds the 20-minute limit. Please re-record a shorter clip.',
    }
  }

  const apiKey = readEnvSecret('RESEND_API_KEY')
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()
  const openAiKey = process.env.OPENAI_API_KEY?.trim()

  if (!apiKey || !notifyTo || !from) {
    console.error('[consultation-audio] Email not configured (set on host for serverless):', {
      hasResendKey: Boolean(apiKey),
      hasNotifyTo: Boolean(notifyTo),
      hasFrom: Boolean(from),
    })
    return { ok: false, status: 503, error: 'Submission is not configured. Please try again later.' }
  }

  // Transcribe with Whisper (graceful — if it fails we still send the audio)
  let transcript = ''
  if (openAiKey) {
    try {
      const openai = new OpenAI({ apiKey: openAiKey })
      const filename = audioFilename(mimeType)
      const audioFile = new File([new Uint8Array(audioBuffer)], filename, { type: mimeType })
      const result = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
      })
      transcript = result.text.trim()
    } catch (err) {
      console.error('[consultation-audio] Whisper transcription error:', err)
    }
  }

  const resend = new Resend(apiKey)
  const base = sitePublicBase()
  const bookHref = `${base}${site.booking.path}`
  const firstName = escapeHtml(contactName.split(' ')[0] || contactName)
  const filename = audioFilename(mimeType)

  // Build basics table for internal email
  const basicsRows = BASIC_LABELS.map(({ id, label }) => {
    const val = answers[id] ? escapeHtml(answers[id]) : '<span style="color:#bbb">—</span>'
    return `<tr>
      <td style="padding:4px 16px 4px 0;font-weight:600;font-size:12px;color:#555;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:4px 0;font-size:13px;color:#1a1a1a;">${val}</td>
    </tr>`
  }).join('')

  const transcriptBlock = transcript
    ? `<h3 style="margin:28px 0 10px;font-size:14px;font-weight:700;color:#1e427b;border-bottom:1px solid #e5e7eb;padding-bottom:6px;">
         Transcript (Whisper AI)
       </h3>
       <p style="font-size:13px;line-height:1.8;color:#1a1a1a;white-space:pre-wrap;">${escapeHtml(transcript)}</p>`
    : `<p style="margin-top:20px;font-size:12px;color:#999;font-style:italic;">
         Transcript not available — see attached audio recording.
       </p>`

  const internalHtml = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;font-size:13px;line-height:1.5;color:#1a1a1a;max-width:760px;">
  <p style="margin:0 0 4px;font-size:18px;font-weight:700;">New Voice Consultation Submission</p>
  <p style="margin:0 0 22px;font-size:13px;color:#666;">
    <strong>${escapeHtml(contactName)}</strong> &lt;${escapeHtml(contactEmail)}&gt;
  </p>
  <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1e427b;border-bottom:1px solid #e5e7eb;padding-bottom:6px;">Contact Details</h3>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${basicsRows}</table>
  ${transcriptBlock}
  <p style="margin-top:24px;font-size:11px;color:#aaa;font-style:italic;">Audio recording attached as ${filename}</p>
</body>
</html>`

  const confirmationHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellspacing="0" cellpadding="0" style="background:#faf9f7;padding:32px 16px;">
<tr><td align="center">
<table width="560" style="max-width:560px;background:#ffffff;border:1px solid rgba(30,66,123,0.12);border-radius:12px;">
<tr><td align="center" style="padding:32px 28px 36px;">
<p style="margin:0 0 18px;font-family:'Cinzel',Georgia,serif;font-size:28px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#1a365d;text-align:center;">${escapeHtml(site.name)}</p>
<p style="margin:0 0 18px;font-size:20px;font-weight:600;color:#000;text-align:center;">We received your recording</p>
<p style="margin:0;font-size:15px;line-height:1.7;color:#444;text-align:center;">
  Thanks, ${firstName}. We'll listen carefully and follow up within 12–24 hours to discuss next steps.
</p>
<p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#666;text-align:center;">
  Prefer to talk sooner? Call us at <strong>${escapeHtml(site.phone.display)}</strong>.
</p>
<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#444;text-align:center;">
  Want to book a call? <a href="${bookHref}" style="color:#1e427b;font-weight:600;text-decoration:underline;">Schedule here</a>
</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 12px;">
<tr><td align="center" style="padding:0 32px;">
<div style="height:1px;max-width:300px;margin:0 auto;background:linear-gradient(90deg,rgba(30,66,123,0) 0%,rgba(30,66,123,0.2) 18%,rgba(30,66,123,0.42) 50%,rgba(30,66,123,0.2) 82%,rgba(30,66,123,0) 100%);"></div>
</td></tr>
</table>
<p style="margin:0;font-size:11px;line-height:1.5;color:#888;text-align:center;">
  You can reply directly to this email.
</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`

  const [toTeam, toUser] = await Promise.all([
    resend.emails.send({
      from,
      to: notifyTo,
      replyTo: contactEmail,
      subject: `Voice Consultation: ${contactName}`,
      html: internalHtml,
      attachments: [{ filename, content: audioBuffer }],
    }),
    resend.emails.send({
      from,
      to: contactEmail,
      subject: `Your voice submission — ${site.name}`,
      html: confirmationHtml,
    }),
  ])

  if (toTeam.error || toUser.error) {
    const err = toTeam.error ?? toUser.error
    console.error('[consultation-audio] Resend error:', err)
    const resendMsg =
      err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string'
        ? (err as { message: string }).message
        : String(err)
    const isDev = process.env.NODE_ENV !== 'production'
    const devHints =
      'Restart the dev server after editing .env (Vite loads env only at startup). ' +
      'If you created a new Resend key, you must copy the full secret the one time it is shown—after that the dashboard only shows a short prefix, which is not a valid key. ' +
      'If you use .env.local, it overrides .env for the same variable names.'
    return {
      ok: false,
      status: 502,
      error: isDev
        ? `Email failed: ${resendMsg} ${devHints} Also verify CONTACT_FROM_EMAIL uses a verified domain in Resend and CONTACT_NOTIFY_EMAIL is set.`
        : 'Could not send your submission. Please try again or call us directly.',
    }
  }

  return { ok: true }
}
