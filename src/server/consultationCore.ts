import { Resend } from 'resend'
import { site } from '../content/site.js'
import { readEnvSecret } from './envUtils.js'

const RATE_WINDOW_MS = 60_000
const MAX_PER_WINDOW = 3

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

export interface ToolRow {
  name: string
  purpose: string
  cost: string
  feedback: string
}

export type ConsultationResult =
  | { ok: true }
  | { ok: false; status: number; error: string }

/** Match title in SECTION_LABELS — tools table is appended after this section in email. */
const SYSTEMS_SECTION_TITLE = '7 — Systems & Tools'

// Field labels for email formatting, in section order (kept in sync with ConsultationPage SECTIONS)
const SECTION_LABELS = [
  {
    title: '1 — Business Basics',
    fields: [
      { id: 'companyName', label: 'Company name' },
      { id: 'website', label: 'Website' },
      { id: 'industry', label: 'Industry / what you sell' },
      { id: 'locations', label: 'Locations & markets' },
      { id: 'companySize', label: 'Company size' },
      { id: 'yourRole', label: 'Your role' },
      { id: 'preferredComm', label: 'Preferred communication' },
    ],
  },
  {
    title: '2 — How You Win',
    fields: [
      { id: 'positioning', label: 'Market positioning' },
      {
        id: 'valueFlowAndUnit',
        label: 'How you make money + unit of work',
      },
    ],
  },
  {
    title: '3 — Outcomes',
    fields: [
      {
        id: 'outcomes90',
        label: '90-day outcomes + stop / start / speed up',
      },
      {
        id: 'successMeasure',
        label: 'Key metric, current (estimate), target',
      },
    ],
  },
  {
    title: '4 — Urgency & Context',
    fields: [
      { id: 'trigger', label: 'What triggered this' },
      { id: 'statusQuo', label: 'If nothing changes in 12 months' },
      { id: 'alreadyTried', label: 'Already tried' },
    ],
  },
  {
    title: '5 — Day-to-Day Operations',
    fields: [
      { id: 'whoDoesWhat', label: 'Who does what' },
      {
        id: 'handoffsAndRework',
        label: 'Handoffs, stalls, rework (recent example)',
      },
      { id: 'whatBreaks', label: 'What breaks if owner absent' },
    ],
  },
  {
    title: '6 — Workflow Story',
    fields: [
      { id: 'workflowName', label: 'Workflow name' },
      { id: 'workflowStart', label: 'Starts when' },
      { id: 'workflowSteps', label: 'Steps' },
      { id: 'workflowEnd', label: 'Done = what?' },
      { id: 'workflowFrequency', label: 'Frequency' },
      { id: 'workflowPain', label: 'What makes it painful' },
      { id: 'workflowDoneRight', label: '"Done right" looks like' },
    ],
  },
  {
    title: SYSTEMS_SECTION_TITLE,
    fields: [
      {
        id: 'dataAndShadowSystems',
        label: 'Where data lives (official + unofficial)',
      },
      { id: 'integrations', label: 'Key integrations' },
      { id: 'underused', label: 'Paying for but barely using' },
      { id: 'wishList', label: 'Tools wish list' },
    ],
  },
  {
    title: '8 — Constraints',
    fields: [
      { id: 'mustNotBreak', label: 'Must not break' },
      {
        id: 'complianceAndAccess',
        label: 'Compliance / legal + security & access',
      },
      {
        id: 'humanAndAudit',
        label: 'Human-only steps + audit / traceability',
      },
    ],
  },
  {
    title: '9 — Automation & Vision',
    fields: [
      {
        id: 'automationVision',
        label: 'Ideal capabilities, automation priorities, first wins if trust were perfect',
      },
    ],
  },
  {
    title: '10 — Project Reality',
    fields: [
      { id: 'timeline', label: 'Timeline' },
      { id: 'budget', label: 'Investment comfort' },
      {
        id: 'stakeholdersAndContact',
        label: 'Who decides, day-to-day contact, who pays',
      },
      { id: 'hardDeadlines', label: 'Hard deadlines' },
    ],
  },
  {
    title: '11 — Materials & Notes',
    fields: [
      { id: 'canShare', label: 'Can share later' },
      { id: 'anythingElse', label: 'Anything else' },
      { id: 'consent', label: 'Submission consent' },
    ],
  },
]

function fieldRow(label: string, value: string): string {
  const display = value
    ? escapeHtml(value).replace(/\n/g, '<br>')
    : '<span style="color:#999">—</span>'
  return `<tr>
    <td style="padding:5px 14px 5px 0;vertical-align:top;font-weight:600;white-space:nowrap;color:#555;font-size:12px;width:220px;">${escapeHtml(label)}</td>
    <td style="padding:5px 0;font-size:13px;color:#1a1a1a;">${display}</td>
  </tr>`
}

function sectionBlock(title: string, rows: string): string {
  return `<h3 style="margin:22px 0 7px;font-size:14px;font-weight:700;color:#1e427b;border-bottom:1px solid #e5e7eb;padding-bottom:5px;">${escapeHtml(title)}</h3>
  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows}</table>`
}

export async function handleConsultationRequest(
  body: unknown,
  clientIp: string,
): Promise<ConsultationResult> {
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
  const answers =
    typeof o.answers === 'object' && o.answers !== null
      ? (o.answers as Record<string, string>)
      : {}
  const toolRows = Array.isArray(o.toolRows) ? (o.toolRows as ToolRow[]) : []

  if (!contactName || !contactEmail) {
    return { ok: false, status: 400, error: 'Name and email are required.' }
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!EMAIL_RE.test(contactEmail)) {
    return { ok: false, status: 400, error: 'Please enter a valid email address.' }
  }

  const apiKey = readEnvSecret('RESEND_API_KEY')
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()

  if (!apiKey || !notifyTo || !from) {
    console.error('[consultation] Email not configured (set on host for serverless):', {
      hasResendKey: Boolean(apiKey),
      hasNotifyTo: Boolean(notifyTo),
      hasFrom: Boolean(from),
    })
    return {
      ok: false,
      status: 503,
      error: 'Contact form is not configured. Please try again later.',
    }
  }

  const resend = new Resend(apiKey)

  const filledToolRows = toolRows.filter((r) => r.name || r.purpose)

  // Build section blocks; append software table right after Systems section
  let sectionsHtml = ''
  for (const sec of SECTION_LABELS) {
    const rows = sec.fields.map((f) => fieldRow(f.label, answers[f.id] || '')).join('')
    sectionsHtml += sectionBlock(sec.title, rows)

    if (sec.title === SYSTEMS_SECTION_TITLE && filledToolRows.length > 0) {
      const toolRowsHtml = filledToolRows
        .map(
          (r) => `<tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:5px 6px;font-size:12px;">${escapeHtml(r.name)}</td>
        <td style="padding:5px 6px;font-size:12px;">${escapeHtml(r.purpose)}</td>
        <td style="padding:5px 6px;font-size:12px;">${escapeHtml(r.cost)}</td>
        <td style="padding:5px 6px;font-size:12px;">${escapeHtml(r.feedback)}</td>
      </tr>`,
        )
        .join('')

      sectionsHtml += `<h4 style="margin:14px 0 6px;font-size:13px;font-weight:700;color:#333;">Software / platforms (table)</h4>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:12px;">
      <thead><tr style="background:#f5f5f5;">
        <th style="padding:5px 6px;text-align:left;font-weight:600;">Tool</th>
        <th style="padding:5px 6px;text-align:left;font-weight:600;">Purpose</th>
        <th style="padding:5px 6px;text-align:left;font-weight:600;">Monthly cost</th>
        <th style="padding:5px 6px;text-align:left;font-weight:600;">Likes / dislikes</th>
      </tr></thead>
      <tbody>${toolRowsHtml}</tbody>
    </table>`
    }
  }

  const internalHtml = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;font-size:13px;line-height:1.5;color:#1a1a1a;max-width:760px;">
  <p style="margin:0 0 4px;font-size:17px;font-weight:700;">New Discovery form</p>
  <p style="margin:0 0 20px;color:#666;font-size:13px;">
    <strong>${escapeHtml(contactName)}</strong> &lt;${escapeHtml(contactEmail)}&gt;
  </p>
  ${sectionsHtml}
</body>
</html>`

  const base = sitePublicBase()
  const bookHref = `${base}${site.booking.path}`
  const firstName = escapeHtml(contactName.split(' ')[0] || contactName)

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
<p style="margin:0 0 18px;font-family:'Cinzel',Georgia,serif;font-size:28px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#1a365d;text-align:center;">${escapeHtml(site.name)}</p>
<p style="margin:0 0 18px;font-size:20px;font-weight:600;color:#000;text-align:center;">We received your Discovery form</p>
<p style="margin:0;font-size:15px;line-height:1.7;color:#444;text-align:center;">
  Thanks, ${firstName}. We'll review your answers carefully and follow up within 12–24 hours to discuss next steps.
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
      subject: `Discovery form: ${contactName}`,
      html: internalHtml,
    }),
    resend.emails.send({
      from,
      to: contactEmail,
      subject: `Your Discovery form — ${site.name}`,
      html: confirmationHtml,
    }),
  ])

  if (toTeam.error || toUser.error) {
    const err = toTeam.error ?? toUser.error
    console.error('[consultation] Resend error', err)
    return {
      ok: false,
      status: 502,
      error: 'Could not send your submission. Please try again or call us directly.',
    }
  }

  return { ok: true }
}
