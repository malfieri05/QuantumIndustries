import { Resend } from 'resend'
import { site } from '../content/site.js'

const RATE_WINDOW_MS = 60_000
const MAX_CONTACT_PER_WINDOW = 5

const MAX_FIRST = 80
const MAX_LAST = 80
const MAX_PHONE = 40
const MAX_MESSAGE = 8000

const contactBuckets = new Map<string, { count: number; resetAt: number }>()

function rateLimitOk(ip: string): boolean {
  const now = Date.now()
  const b = contactBuckets.get(ip)
  if (!b || now > b.resetAt) {
    contactBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (b.count >= MAX_CONTACT_PER_WINDOW) return false
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sitePublicBase(): string {
  const fromEnv = process.env.SITE_PUBLIC_URL?.trim().replace(/\/$/, '')
  return fromEnv || site.publicUrl
}

function strField(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  if (!t || t.length > max) return null
  return t
}

export type ContactResult =
  | { ok: true }
  | { ok: false; status: number; error: string }

export async function handleContactRequest(
  body: unknown,
  clientIp: string,
): Promise<ContactResult> {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, status: 400, error: 'Invalid request body.' }
  }

  const o = body as Record<string, unknown>
  if (typeof o.honeypot === 'string' && o.honeypot.trim() !== '') {
    return { ok: true }
  }

  if (!rateLimitOk(clientIp)) {
    return { ok: false, status: 429, error: 'Too many submissions. Try again in a minute.' }
  }

  const firstName = strField(o.firstName, MAX_FIRST)
  const lastName = strField(o.lastName, MAX_LAST)
  const emailRaw = strField(o.email, 320)
  const phone = strField(o.phone, MAX_PHONE)
  const message = strField(o.message, MAX_MESSAGE)

  if (!firstName || !lastName || !emailRaw || !phone || !message) {
    return {
      ok: false,
      status: 400,
      error: 'Please fill in all fields with valid values.',
    }
  }

  if (!EMAIL_RE.test(emailRaw)) {
    return { ok: false, status: 400, error: 'Please enter a valid email address.' }
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()

  if (!apiKey || !notifyTo || !from) {
    return {
      ok: false,
      status: 503,
      error: 'Contact form is not configured. Please try again later.',
    }
  }

  const resend = new Resend(apiKey)
  const fullName = `${firstName} ${lastName}`
  const safe = {
    firstName: escapeHtml(firstName),
    lastName: escapeHtml(lastName),
    email: escapeHtml(emailRaw),
    phone: escapeHtml(phone),
    message: escapeHtml(message).replace(/\n/g, '<br />'),
  }

  const internalHtml = `
<!DOCTYPE html>
<html><body style="margin:0;font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a;">
<p><strong>New contact form submission</strong></p>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
<tr><td><strong>Name</strong></td><td>${safe.firstName} ${safe.lastName}</td></tr>
<tr><td><strong>Email</strong></td><td>${safe.email}</td></tr>
<tr><td><strong>Phone</strong></td><td>${safe.phone}</td></tr>
</table>
<p><strong>Message</strong></p>
<p style="white-space:pre-wrap;">${safe.message}</p>
</body></html>`

  const base = sitePublicBase()
  const bookHref = `${base}${site.booking.path}`

  const confirmationHtml = `
<!DOCTYPE html>
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
<p style="margin:0 0 18px;padding:0;font-family:'Cinzel',Georgia,'Times New Roman',Times,serif;font-size:30px;line-height:1.25;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#1a365d;text-align:center;">
${escapeHtml(site.name)}
</p>
<p style="margin:0 0 18px;padding:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.35;font-weight:600;color:#000000;text-align:center;">
We received your message
</p>
<p style="margin:0;font-size:16px;line-height:1.65;color:#444;text-align:center;">
Thanks, ${safe.firstName}. We will review your message and get back to you within 24 hours.
</p>
<p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:#666;text-align:center;">
Prefer to talk now? Call us at <strong>${escapeHtml(site.phone.display)}</strong>.
</p>
<p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#444;text-align:center;">
Free consultation? <a href="${bookHref}" style="color:#1e427b;font-weight:600;text-decoration:underline;">Book here</a>:
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
      replyTo: emailRaw,
      subject: `Contact: ${fullName}`,
      html: internalHtml,
    }),
    resend.emails.send({
      from,
      to: emailRaw,
      subject: `Thanks for contacting ${site.name}`,
      html: confirmationHtml,
    }),
  ])

  if (toTeam.error || toUser.error) {
    const err = toTeam.error ?? toUser.error
    console.error('[contact] Resend error', err)
    return {
      ok: false,
      status: 502,
      error: 'Could not send your message. Please try again or call us directly.',
    }
  }

  return { ok: true }
}
