import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SiteHeaderBrand } from '../components/SiteHeaderBrand'
import { site } from '../content/site'
import { playBookingTapSound, playBookingTapSoundReverse } from '../lib/bookingTapSound'
import { routeSlide } from '../lib/routeTransitions'
import type { ToolRow } from '../server/consultationCore'

const API_URL = import.meta.env.VITE_CONSULTATION_API_URL?.trim() || '/api/consultation'
const AUDIO_API_URL =
  import.meta.env.VITE_CONSULTATION_AUDIO_API_URL?.trim() || '/api/consultation-audio'

// ── Types ────────────────────────────────────────────────────────────────────

type TextField = {
  id: string
  label: string
  type: 'text' | 'email' | 'tel'
  required?: boolean
  placeholder?: string
  hint?: string
}
type TextareaField = {
  id: string
  label: string
  type: 'textarea'
  required?: boolean
  placeholder?: string
  rows?: number
  hint?: string
}
type RadioField = {
  id: string
  label: string
  type: 'radio'
  options: readonly string[]
  required?: boolean
  /** Single row / wrap on wide basics layout */
  inlineOptions?: boolean
}
type CheckboxField = {
  id: string
  label: string
  type: 'checkbox'
  options: readonly string[]
  required?: boolean
  inlineOptions?: boolean
}

type FieldDef = TextField | TextareaField | RadioField | CheckboxField

interface SectionDef {
  title: string
  subtitle?: string
  /** Two-column grid + compact controls — used for Business Basics only */
  layout?: 'default' | 'basics-wide'
  fields: FieldDef[]
  includeToolRows?: boolean
}

// ── Section definitions ───────────────────────────────────────────────────────

const SECTIONS: SectionDef[] = [
  {
    title: '1 · Business Basics',
    layout: 'basics-wide',
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'website', label: 'Website', type: 'text', placeholder: 'https://' },
      { id: 'industry', label: 'Industry / what you sell', type: 'text', required: true },
      { id: 'locations', label: 'Location(s) & markets served', type: 'text' },
      {
        id: 'companySize',
        label: 'Company size',
        type: 'radio',
        required: true,
        inlineOptions: true,
        options: ['1–10 employees', '11–50 employees', '51–200 employees', '201+ employees'],
      },
      {
        id: 'yourRole',
        label: 'Your role',
        type: 'text',
        placeholder: 'e.g. Owner, GM, Operations Manager',
        required: true,
      },
      { id: 'contactName', label: 'Your full name', type: 'text', required: true },
      { id: 'contactEmail', label: 'Email', type: 'email', required: true },
      { id: 'contactPhone', label: 'Phone', type: 'tel', required: true },
      {
        id: 'preferredComm',
        label: 'Preferred communication',
        type: 'checkbox',
        inlineOptions: true,
        options: ['Email', 'Text / SMS', 'Phone call', 'Video call'],
      },
    ],
  },
  {
    title: '2 · How You Win',
    subtitle: 'Help us understand your market position and how value flows through your business.',
    fields: [
      {
        id: 'positioning',
        label: 'How do you position yourself in your market today?',
        type: 'textarea',
        placeholder: 'What makes you different, or what you want it to be',
        rows: 3,
      },
      {
        id: 'valueFlowAndUnit',
        label:
          'How does the business make money end-to-end — and what counts as one "unit of work" for you?',
        type: 'textarea',
        placeholder:
          'Money flow (e.g. lead → quote → job → invoice → cash) and your unit of work (one job, order, case, project, etc.). Bullets are fine.',
        rows: 4,
      },
    ],
  },
  {
    title: '3 · Outcomes',
    subtitle: 'Define what success looks like before we talk tools.',
    fields: [
      {
        id: 'outcomes90',
        label:
          'If this worked perfectly, what would be different in about 90 days? List up to 3 outcomes (bullets OK). What would you stop doing, start doing, or do faster?',
        type: 'textarea',
        rows: 5,
      },
      {
        id: 'successMeasure',
        label: 'Key success metric — rough current vs target',
        type: 'textarea',
        placeholder:
          'e.g. Metric: quote turnaround · Current: ~48h · Target: same-day. Or any format that is easy for you.',
        rows: 3,
        hint: 'Rough estimates are fine.',
      },
    ],
  },
  {
    title: '4 · Urgency & Context',
    fields: [
      {
        id: 'trigger',
        label: 'What triggered this conversation right now?',
        type: 'textarea',
        rows: 3,
      },
      {
        id: 'statusQuo',
        label: 'What happens if nothing changes in the next 6–12 months?',
        type: 'textarea',
        rows: 3,
      },
      {
        id: 'alreadyTried',
        label: 'What have you already tried?',
        type: 'textarea',
        placeholder: 'Tools, vendors, hiring, spreadsheets, "we just work harder"',
        rows: 3,
      },
    ],
  },
  {
    title: '5 · Day-to-Day Operations',
    subtitle: "We're mapping how work actually happens — not the org chart.",
    fields: [
      {
        id: 'whoDoesWhat',
        label: 'Who does what today — even if roles are informal?',
        type: 'textarea',
        placeholder: 'List names/roles, or describe the functions that exist',
        rows: 4,
      },
      {
        id: 'handoffsAndRework',
        label:
          'Where do handoffs stall or fail — and what is the most common "dropped ball" or rework? (One recent example helps.)',
        type: 'textarea',
        rows: 4,
      },
      {
        id: 'whatBreaks',
        label: 'If you were unavailable for two weeks, what would break first?',
        type: 'textarea',
        rows: 2,
      },
    ],
  },
  {
    title: '6 · One Workflow Story',
    subtitle: 'Pick the most annoying or highest-volume workflow from the last 1–2 weeks.',
    fields: [
      {
        id: 'workflowName',
        label: 'Workflow name',
        type: 'text',
        placeholder: 'e.g. "Client onboarding", "Quote to job", "Weekly reporting"',
      },
      { id: 'workflowStart', label: 'It starts when…', type: 'text' },
      {
        id: 'workflowSteps',
        label: 'What happens step by step?',
        type: 'textarea',
        placeholder: 'Bullets are fine. Include the people, tools, and decisions involved.',
        rows: 6,
      },
      { id: 'workflowEnd', label: 'Where does it end? (done = what?)', type: 'text' },
      {
        id: 'workflowFrequency',
        label: 'How often does this run?',
        type: 'text',
        placeholder: 'e.g. daily, 50× per week, every time a new customer signs up',
      },
      {
        id: 'workflowPain',
        label: 'What makes it painful today?',
        type: 'textarea',
        placeholder: 'Time, errors, chasing info, double entry, waiting on customers, etc.',
        rows: 3,
      },
      {
        id: 'workflowDoneRight',
        label: 'What does "done right" look like?',
        type: 'textarea',
        placeholder: "From the customer's perspective and yours",
        rows: 3,
      },
    ],
  },
  {
    title: '7 · Systems, Data & Tools',
    subtitle: 'Tell us what your current tech stack looks like.',
    includeToolRows: true,
    fields: [
      {
        id: 'dataAndShadowSystems',
        label:
          'Where does critical data actually live today — both "official" systems and unofficial places?',
        type: 'textarea',
        placeholder:
          'Official: CRM, ERP, accounting, etc. Unofficial: text threads, personal email, spreadsheets, paper, inbox.',
        rows: 4,
      },
      {
        id: 'integrations',
        label: 'What integrations matter most?',
        type: 'textarea',
        placeholder: 'Accounting, calendar, email, phones, inventory, payments, industry-specific',
        rows: 2,
      },
      { id: 'underused', label: 'What are you paying for but barely using?', type: 'text' },
      {
        id: 'wishList',
        label: "Tools you wish you had (too expensive, not yet adopted, or didn't know existed)?",
        type: 'textarea',
        rows: 2,
      },
    ],
  },
  {
    title: '8 · Constraints',
    subtitle: "So we build responsibly and don't break what matters.",
    fields: [
      {
        id: 'mustNotBreak',
        label: 'What must not break during any change?',
        type: 'textarea',
        placeholder: 'Billing, scheduling, compliance reporting, customer-facing systems, etc.',
        rows: 3,
      },
      {
        id: 'complianceAndAccess',
        label: 'Compliance / legal / industry requirements — and security & access we should assume',
        type: 'textarea',
        placeholder:
          'Regulations (HIPAA, PCI, retention, etc.) or "none". Also: who should see what, shared logins, contractors, locations.',
        rows: 4,
      },
      {
        id: 'humanAndAudit',
        label:
          'What must stay human-only — and what outputs need to be auditable or traceable (who / what / when)?',
        type: 'textarea',
        placeholder: 'Judgment calls, approvals, trust moments, safety-critical steps; logging or proof needs.',
        rows: 4,
      },
    ],
  },
  {
    title: '9 · Automation & Vision',
    subtitle: "No buzzwords — think big; we'll narrow to what's realistic together.",
    fields: [
      {
        id: 'automationVision',
        label:
          'Ideal capabilities your systems do not have today, where automation would help most if it were fully reliable, and what you would tackle first if trust were not an issue (bullets OK).',
        type: 'textarea',
        rows: 7,
      },
    ],
  },
  {
    title: '10 · Project Reality',
    subtitle: 'Help us understand scope, timing, and decision process.',
    fields: [
      {
        id: 'timeline',
        label: 'Ideal timeline',
        type: 'radio',
        options: ['ASAP / this quarter', 'Next quarter', 'Exploratory — no fixed date'],
      },
      {
        id: 'budget',
        label: 'Investment comfort',
        type: 'radio',
        options: [
          'Under $5k one-time',
          '$5k–$25k',
          '$25k–$100k',
          '$100k+',
          'Prefer monthly retainer',
          'Not sure yet',
        ],
      },
      {
        id: 'stakeholdersAndContact',
        label: 'Who is involved in the decision — and who is our day-to-day contact?',
        type: 'textarea',
        placeholder: 'Deciders, approvers, who uses the outcome, who pays, primary contact name & role.',
        rows: 3,
      },
      {
        id: 'hardDeadlines',
        label: 'Any hard deadlines?',
        type: 'text',
        placeholder: 'Seasonality, audit, launch, contract renewal, etc.',
      },
    ],
  },
  {
    title: '11 · Materials & Anything Else',
    fields: [
      {
        id: 'canShare',
        label: 'What can you share with us later? (optional)',
        type: 'checkbox',
        options: [
          'Screenshots of current workflow',
          'Sample data export (CSV, no sensitive fields)',
          'Example intake form or quote template',
          'Short screen recording (Loom)',
        ],
      },
      {
        id: 'anythingElse',
        label: 'Anything else we should know?',
        type: 'textarea',
        rows: 4,
      },
      {
        id: 'consent',
        label:
          "By submitting, I confirm this information is accurate and I'm comfortable with ARK Solutions using it to prepare recommendations for my business.",
        type: 'checkbox',
        options: ['I confirm'],
        required: true,
      },
    ],
  },
]

// ── Print view ────────────────────────────────────────────────────────────────

function PrintAnswer({ field, val }: { field: FieldDef; val: string }) {
  const blankLine = (height: number) => (
    <div style={{ borderBottom: '1px solid #bbb', height, marginTop: 4 }} />
  )

  if (field.type === 'radio' || field.type === 'checkbox') {
    const selected = new Set(
      field.type === 'checkbox'
        ? val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : val
          ? [val]
          : [],
    )
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 4 }}>
        {field.options.map((opt) => (
          <span key={opt} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 13,
                height: 13,
                border: '1px solid #666',
                borderRadius: field.type === 'radio' ? '50%' : 2,
                fontSize: 9,
                color: '#1e427b',
                flexShrink: 0,
              }}
            >
              {selected.has(opt) ? '✓' : ''}
            </span>
            {opt}
          </span>
        ))}
      </div>
    )
  }

  if (!val) {
    return blankLine(field.type === 'textarea' ? (field.rows ?? 3) * 18 : 18)
  }

  return (
    <div style={{ marginTop: 4, fontSize: 12, whiteSpace: 'pre-wrap', color: '#1a1a1a', lineHeight: 1.5 }}>
      {val}
    </div>
  )
}

function PrintView({
  answers,
  toolRows,
}: {
  answers: Record<string, string>
  toolRows: ToolRow[]
}) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const blankToolRows = Math.max(0, 5 - toolRows.length)

  return (
    <div style={{ fontFamily: 'Georgia, serif', padding: '0 2px', color: '#1a1a1a' }}>
      {/* Document header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '2px solid #1e427b',
          paddingBottom: 14,
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Logo + wordmark share one visual row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <img
              src="/coreNOBACKGROUND.png"
              alt=""
              width={40}
              height={40}
              style={{
                width: 36,
                height: 36,
                objectFit: 'contain' as const,
                flexShrink: 0,
                display: 'block',
              }}
            />
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: '#1a365d',
                lineHeight: 1.15,
              }}
            >
              ARK Solutions
            </div>
          </div>
          {/* Subline flush with logo / column left */}
          <div style={{ fontSize: 11, color: '#666', marginTop: 4, lineHeight: 1.35 }}>
            Custom Software &amp; AI Implementation · arksolutions.ai
          </div>
        </div>
        <div style={{ textAlign: 'right' as const, fontSize: 11, color: '#777' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>
            Discovery form
          </div>
          <div>{today}</div>
          <div style={{ marginTop: 4, color: '#1e427b' }}>{site.phone.display}</div>
        </div>
      </div>

      {/* Intro */}
      <p
        style={{
          fontSize: 11,
          color: '#555',
          marginBottom: 22,
          lineHeight: 1.65,
          borderLeft: '3px solid #d0dae8',
          paddingLeft: 10,
        }}
      >
        Thank you for taking the time to complete this. Your answers help us understand your
        business, priorities, and constraints so we can recommend the right approach. Rough
        estimates are always fine.
      </p>

      {/* Sections */}
      {SECTIONS.map((section, si) => (
        <div
          key={si}
          style={{ marginBottom: 24, pageBreakInside: 'avoid' as const }}
        >
          {/* Section heading */}
          <div
            style={{
              background: '#eef2f8',
              padding: '7px 10px',
              marginBottom: 12,
              borderLeft: '3px solid #1e427b',
            }}
          >
            <div
              style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, fontWeight: 700, color: '#1e427b' }}
            >
              {section.title}
            </div>
            {section.subtitle && (
              <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{section.subtitle}</div>
            )}
          </div>

          {/* Tool rows table */}
          {section.includeToolRows && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#333', marginBottom: 5 }}>
                Software / platforms currently used:
              </div>
              <table
                style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 10 }}
              >
                <thead>
                  <tr style={{ background: '#f0f4fa' }}>
                    {['Tool / Platform', 'What it\'s used for', 'Monthly cost', 'Likes / dislikes'].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            border: '1px solid #ccc',
                            padding: '4px 6px',
                            textAlign: 'left' as const,
                            fontWeight: 600,
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {toolRows.map((row, ri) => (
                    <tr key={ri}>
                      <td style={{ border: '1px solid #ccc', padding: '5px 6px', height: 22 }}>{row.name}</td>
                      <td style={{ border: '1px solid #ccc', padding: '5px 6px', height: 22 }}>{row.purpose}</td>
                      <td style={{ border: '1px solid #ccc', padding: '5px 6px', height: 22 }}>{row.cost}</td>
                      <td style={{ border: '1px solid #ccc', padding: '5px 6px', height: 22 }}>{row.feedback}</td>
                    </tr>
                  ))}
                  {Array.from({ length: blankToolRows }).map((_, bi) => (
                    <tr key={`b${bi}`}>
                      {[0, 1, 2, 3].map((ci) => (
                        <td
                          key={ci}
                          style={{ border: '1px solid #ccc', padding: '5px 6px', height: 22 }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fields */}
          <div style={{ display: 'grid', gap: 10 }}>
            {section.fields.map((field) => (
              <div key={field.id} style={{ pageBreakInside: 'avoid' as const }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#444',
                    marginBottom: 1,
                    fontFamily: 'system-ui, sans-serif',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.04em',
                  }}
                >
                  {field.label}
                  {field.required && <span style={{ color: '#c00', marginLeft: 2 }}>*</span>}
                </div>
                <PrintAnswer field={field} val={answers[field.id] || ''} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Signature line */}
      <div
        style={{
          borderTop: '1px solid #ccc',
          marginTop: 28,
          paddingTop: 14,
          display: 'flex',
          justifyContent: 'space-between' as const,
          alignItems: 'flex-end',
          fontSize: 11,
          color: '#777',
          gap: 24,
        }}
      >
        <div>
          <div style={{ borderBottom: '1px solid #aaa', width: 220, marginBottom: 4 }} />
          <div>Signature</div>
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <div style={{ borderBottom: '1px solid #aaa', width: 120, marginBottom: 4 }} />
          <div>Date</div>
        </div>
        <div style={{ textAlign: 'right' as const, fontSize: 10 }}>
          ARK Solutions · arksolutions.ai<br />
          {site.phone.display}
        </div>
      </div>
    </div>
  )
}

// ── Tool rows input ───────────────────────────────────────────────────────────

const cellInput =
  'w-full rounded-lg border border-black/[0.13] bg-white/80 px-3 py-2 text-sm text-qi-fg outline-none transition placeholder:text-qi-muted/55 focus:border-qi-fg/40 focus:ring-1 focus:ring-[#1e427b]/25'

function ToolRowsInput({
  rows,
  onChange,
}: {
  rows: ToolRow[]
  onChange: (rows: ToolRow[]) => void
}) {
  function update(i: number, field: keyof ToolRow, val: string) {
    onChange(rows.map((r, ri) => (ri === i ? { ...r, [field]: val } : r)))
  }
  function addRow() {
    if (rows.length < 7) onChange([...rows, { name: '', purpose: '', cost: '', feedback: '' }])
  }
  function removeRow(i: number) {
    if (rows.length > 1) onChange(rows.filter((_, ri) => ri !== i))
  }

  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-qi-muted">
        Software / platforms currently used
      </div>
      <div className="overflow-x-auto [scrollbar-gutter:stable]">
        <table className="w-full min-w-[580px] border-collapse">
          <thead>
            <tr className="border-b border-black/[0.07]">
              {['Tool / platform', "What it's used for", 'Monthly cost', 'Likes / dislikes'].map(
                (h) => (
                  <th
                    key={h}
                    className="pb-2 pr-2 text-left text-[11px] font-medium text-qi-muted"
                  >
                    {h}
                  </th>
                ),
              )}
              <th className="pb-2 w-7" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-black/[0.04]">
                <td className="py-1.5 pr-2 w-[24%]">
                  <input
                    type="text"
                    placeholder="e.g. QuickBooks"
                    value={row.name}
                    onChange={(e) => update(i, 'name', e.target.value)}
                    className={cellInput}
                  />
                </td>
                <td className="py-1.5 pr-2 w-[26%]">
                  <input
                    type="text"
                    placeholder="Invoicing, CRM, etc."
                    value={row.purpose}
                    onChange={(e) => update(i, 'purpose', e.target.value)}
                    className={cellInput}
                  />
                </td>
                <td className="py-1.5 pr-2 w-[18%]">
                  <input
                    type="text"
                    placeholder="~$150/mo"
                    value={row.cost}
                    onChange={(e) => update(i, 'cost', e.target.value)}
                    className={cellInput}
                  />
                </td>
                <td className="py-1.5 pr-2">
                  <input
                    type="text"
                    placeholder="Like: reports. Dislike: slow"
                    value={row.feedback}
                    onChange={(e) => update(i, 'feedback', e.target.value)}
                    className={cellInput}
                  />
                </td>
                <td className="py-1.5">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-qi-muted transition hover:bg-red-50 hover:text-red-500 disabled:opacity-25"
                    aria-label="Remove row"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length < 7 && (
        <button
          type="button"
          onClick={addRow}
          className="mt-3 flex items-center gap-1.5 rounded-lg border border-black/[0.11] bg-white/60 px-3 py-1.5 text-xs font-medium text-qi-muted transition hover:bg-white hover:text-qi-fg"
        >
          <span aria-hidden>+</span> Add tool
        </button>
      )}
    </div>
  )
}

// ── Field renderer ────────────────────────────────────────────────────────────

const inputClass =
  'mt-1.5 w-full rounded-xl border border-black/[0.16] bg-white/80 px-4 py-3 text-sm text-qi-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition placeholder:text-qi-muted/70 focus:border-qi-fg/40 focus:ring-2 focus:ring-[#1e427b]/30'
const labelClass = 'text-xs font-medium uppercase tracking-wider text-qi-muted'

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: string
  onChange: (v: string) => void
}) {
  const required = field.required ? (
    <span className="ml-0.5 text-red-500" aria-hidden="true">
      *
    </span>
  ) : null

  if (field.type === 'radio') {
    return (
      <fieldset>
        <legend className={labelClass}>
          {field.label}
          {required}
        </legend>
        <div
          className={
            field.inlineOptions
              ? 'mt-2.5 flex flex-row flex-wrap gap-x-5 gap-y-2'
              : 'mt-2.5 flex flex-col gap-2'
          }
        >
          {field.options.map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="h-4 w-4 shrink-0 accent-[#1e427b]"
              />
              <span className="text-sm text-qi-fg">{opt}</span>
            </label>
          ))}
        </div>
      </fieldset>
    )
  }

  if (field.type === 'checkbox') {
    const selected = new Set(
      value
        ? value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    )
    function toggle(opt: string) {
      const next = new Set(selected)
      if (next.has(opt)) next.delete(opt)
      else next.add(opt)
      onChange([...next].join(', '))
    }
    return (
      <div>
        <div className={labelClass}>
          {field.label}
          {required}
        </div>
        <div
          className={
            field.inlineOptions
              ? 'mt-2.5 flex flex-row flex-wrap gap-x-5 gap-y-2'
              : 'mt-2.5 flex flex-col gap-2'
          }
        >
          {field.options.map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={selected.has(opt)}
                onChange={() => toggle(opt)}
                className="h-4 w-4 shrink-0 accent-[#1e427b]"
              />
              <span className="text-sm text-qi-fg">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className={labelClass}>
          {field.label}
          {required}
        </label>
        {field.hint && <p className="mt-0.5 text-xs text-qi-muted/80">{field.hint}</p>}
        <textarea
          rows={field.rows ?? 3}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} min-h-[5rem] resize-y`}
        />
      </div>
    )
  }

  // text | email | tel
  return (
    <div>
      <label className={labelClass}>
        {field.label}
        {required}
      </label>
      {field.hint && <p className="mt-0.5 text-xs text-qi-muted/80">{field.hint}</p>}
      <input
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  )
}

// ── Download icon ─────────────────────────────────────────────────────────────

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 10a7 7 0 0014 0M12 19v3M9 22h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 12.5l2.5 2.5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FormIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 8h8M8 12h8M8 16h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Mode toggle (segmented control — full form / audio render below in parent) ─

function DiscoveryModeToggle({
  mode,
  onModeChange,
  onBackToBasics,
  showBackLink = false,
}: {
  mode: 'form' | 'audio'
  onModeChange: (mode: 'form' | 'audio') => void
  onBackToBasics?: () => void
  showBackLink?: boolean
}) {
  return (
    <div className="space-y-3">
      <div
        className="relative mx-auto flex max-w-md rounded-full border border-black/[0.1] bg-black/[0.035] p-1"
        role="tablist"
        aria-label="Answer format"
      >
        {/* Sliding pill: each segment shares space with fixed w-8 “or” column */}
        <div
          aria-hidden
          className={`pointer-events-none absolute left-1 top-1 bottom-1 z-0 w-[calc((100%-0.5rem-2rem)/2)] rounded-full border-2 border-[#1e427b] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform ${
            mode === 'audio' ? 'translate-x-[calc(100%+2rem)]' : 'translate-x-0'
          }`}
        />
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'form'}
          onClick={() => onModeChange('form')}
          className={`relative z-10 flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors duration-200 sm:min-h-10 sm:px-3 sm:py-2 sm:text-xs ${
            mode === 'form' ? 'text-qi-fg' : 'text-qi-muted hover:text-qi-fg'
          }`}
        >
          <FormIcon
            className={`h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 ${mode === 'form' ? 'opacity-90' : 'opacity-70'}`}
          />
          Fill out form
        </button>
        <span
          className="relative z-10 flex w-8 shrink-0 select-none items-center justify-center text-[10px] font-medium lowercase tracking-wide text-qi-muted/90 sm:text-[11px]"
          aria-hidden
        >
          or
        </span>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'audio'}
          onClick={() => onModeChange('audio')}
          className={`relative z-10 flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors duration-200 sm:min-h-10 sm:px-3 sm:py-2 sm:text-xs ${
            mode === 'audio' ? 'text-qi-fg' : 'text-qi-muted hover:text-qi-fg'
          }`}
        >
          <MicIcon
            className={`h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 ${mode === 'audio' ? 'opacity-90' : 'opacity-70'}`}
          />
          Record speech
        </button>
      </div>

      {showBackLink && onBackToBasics ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onBackToBasics}
            className="text-xs text-qi-muted underline-offset-2 transition hover:text-qi-fg hover:underline"
          >
            ← Back to edit basics
          </button>
        </div>
      ) : null}
    </div>
  )
}

// ── Audio recorder ────────────────────────────────────────────────────────────

type RecState = 'idle' | 'requesting' | 'recording' | 'stopped'

interface AudioResult {
  base64: string
  mimeType: string
  url: string
  duration: number
}

function AudioRecorder({
  onSubmit,
  onBack,
  submitStatus,
  submitError,
}: {
  onSubmit: (base64: string, mimeType: string) => void
  onBack: () => void
  submitStatus: 'idle' | 'submitting' | 'error'
  submitError: string
}) {
  const [recState, setRecState] = useState<RecState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [bars, setBars] = useState<number[]>(new Array(32).fill(0))
  const [micError, setMicError] = useState('')
  const [audioResult, setAudioResult] = useState<AudioResult | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rafRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  // stable ref for elapsed inside the interval callback
  const elapsedRef = useRef(0)

  useEffect(() => {
    return () => {
      stopMedia()
      if (audioResult) URL.revokeObjectURL(audioResult.url)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function stopMedia() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    analyserRef.current = null
  }
  const analyserRef = useRef<AnalyserNode | null>(null)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  /** MediaRecorder WebM often has no duration in metadata until we seek (Chrome/Safari). */
  useEffect(() => {
    if (recState !== 'stopped' || !audioResult) return
    let cancelled = false
    let seekFixStarted = false

    const tryFix = () => {
      const el = previewAudioRef.current
      if (!el || cancelled || seekFixStarted) return
      const d = el.duration
      if (Number.isFinite(d) && d > 0 && d !== Infinity) return
      seekFixStarted = true
      const onSeeked = () => {
        el.removeEventListener('seeked', onSeeked)
        el.currentTime = 0
      }
      el.addEventListener('seeked', onSeeked, { once: true })
      try {
        el.currentTime = 1e10
      } catch {
        seekFixStarted = false
        el.removeEventListener('seeked', onSeeked)
      }
    }

    const el = previewAudioRef.current
    if (!el) return

    const onMeta = () => {
      if (!cancelled) tryFix()
    }
    el.addEventListener('loadedmetadata', onMeta)
    const t = window.setTimeout(() => {
      if (!cancelled) tryFix()
    }, 80)

    return () => {
      cancelled = true
      el.removeEventListener('loadedmetadata', onMeta)
      window.clearTimeout(t)
    }
  }, [recState, audioResult])

  function fmt(s: number): string {
    return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  }

  async function startRecording() {
    setMicError('')
    setRecState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream

      // Audio context + analyser for waveform
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const gain = ctx.createGain()
      gain.gain.value = 1.7
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64 // 32 frequency bins — good for voice
      analyser.smoothingTimeConstant = 0.46
      analyser.minDecibels = -97
      analyser.maxDecibels = -26
      source.connect(gain)
      gain.connect(analyser)
      analyserRef.current = analyser

      // Choose best supported MIME type
      const preferredMime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', ''].find(
        (m) => m === '' || MediaRecorder.isTypeSupported(m),
      ) ?? ''
      const recOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 16_000, // 16 kbps — clear voice, compact size
        ...(preferredMime ? { mimeType: preferredMime } : {}),
      }
      const recorder = new MediaRecorder(stream, recOptions)
      recorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const finalDuration = elapsedRef.current
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1] ?? ''
          setAudioResult({ base64, mimeType: blob.type, url, duration: finalDuration })
        }
        reader.readAsDataURL(blob)
        stopMedia()
        setBars(new Array(32).fill(0))
        setRecState('stopped')
      }

      recorder.start(250) // collect chunks every 250 ms
      setRecState('recording')

      // Count-up timer
      elapsedRef.current = 0
      setElapsed(0)
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1
        setElapsed(elapsedRef.current)
        if (elapsedRef.current >= 20 * 60) {
          recorder.stop()
        }
      }, 1000)

      // Waveform: symmetric (center-weighted) mapping + gain + peak envelope for quiet, snappy motion
      const dataArr = new Uint8Array(analyser.frequencyBinCount)
      const nBins = 32
      const peak = new Float32Array(nBins)
      const GAIN = 1.78
      const DECAY = 0.86
      function animFrame() {
        analyserRef.current?.getByteFrequencyData(dataArr)
        const raw = Array.from(dataArr.slice(0, nBins), (v) => v / 255)
        const mid = (nBins - 1) / 2
        const mapped = new Array<number>(nBins)
        for (let i = 0; i < nBins; i++) {
          const distFromCenter = Math.abs(i - mid) / mid
          const bin = Math.min(nBins - 2, Math.round(distFromCenter * (nBins - 1)))
          const symmetric = Math.max(raw[bin] ?? 0, raw[bin + 1] ?? 0)
          const local = Math.max(raw[i] ?? 0, raw[Math.min(nBins - 1, i + 1)] ?? 0)
          const blended = symmetric * 0.56 + local * 0.44
          const boosted = Math.min(1, blended * GAIN)
          peak[i] = Math.max(boosted, peak[i] * DECAY)
          mapped[i] = Math.min(1, peak[i])
        }
        setBars(mapped)
        rafRef.current = requestAnimationFrame(animFrame)
      }
      rafRef.current = requestAnimationFrame(animFrame)
    } catch (err) {
      setRecState('idle')
      const e = err as Error
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setMicError(
          'Microphone access was denied. Please allow microphone access in your browser settings and try again.',
        )
      } else {
        setMicError('Could not access your microphone. Please check your device settings.')
      }
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
  }

  function reRecord() {
    if (audioResult) { URL.revokeObjectURL(audioResult.url); setAudioResult(null) }
    elapsedRef.current = 0
    setElapsed(0)
    setBars(new Array(32).fill(0))
    setMicError('')
    setRecState('idle')
  }

  return (
    <div className="space-y-4">
      {/* ── Recording controls (compact card) ── */}
      <div className="support-memo-panel px-4 py-3 sm:px-5 sm:py-4">
        {/* Tight header row */}
        <div className="mb-2 flex items-start justify-between gap-2 border-b border-black/[0.06] pb-2">
          <div className="min-w-0 pr-2">
            <h2 className="font-display text-base font-semibold tracking-tight text-qi-fg sm:text-lg">
              Voice Recording
            </h2>
            <p className="mt-0.5 text-[11px] leading-snug text-qi-muted sm:text-xs">
              Use the topic list below while you talk — cover what feels relevant.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 pt-0.5 text-[11px] text-qi-muted underline-offset-2 transition hover:text-qi-fg hover:underline sm:text-xs"
          >
            ← Typed form
          </button>
        </div>

        {/* Error */}
        {micError && (
          <div className="mb-2 rounded-lg border border-red-200 bg-red-50/60 px-3 py-2 text-xs text-red-700 sm:text-sm">
            {micError}
            <button
              type="button"
              onClick={() => { setMicError(''); setRecState('idle') }}
              className="ml-2 underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Idle — mic + copy in one horizontal band */}
        {recState === 'idle' && !micError && (
          <div className="flex items-center gap-4 py-1 sm:gap-5">
            <button
              type="button"
              onClick={startRecording}
              className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1e427b]/10 text-[#1e427b] shadow-sm transition hover:bg-[#1e427b]/18 active:scale-95 sm:h-16 sm:w-16"
              aria-label="Start recording"
            >
              <MicIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-xs font-medium text-qi-fg sm:text-sm">Tap to start</p>
              <p className="text-[11px] leading-snug text-qi-muted sm:text-xs">
                Max 20 minutes · We transcribe with AI after you submit.
              </p>
            </div>
          </div>
        )}

        {/* Requesting mic */}
        {recState === 'requesting' && (
          <div className="flex items-center gap-3 py-1">
            <div className="h-7 w-7 shrink-0 animate-spin rounded-full border-2 border-[#1e427b]/20 border-t-[#1e427b]" />
            <p className="text-xs text-qi-muted sm:text-sm">Requesting microphone access…</p>
          </div>
        )}

        {/* Recording — waveform + timer + stop on one/two tight rows */}
        {recState === 'recording' && (
          <div className="space-y-2 py-0.5">
            <div
              className="flex w-full items-end justify-center gap-[2px] sm:gap-[3px]"
              style={{ height: 36 }}
              aria-hidden="true"
            >
              {bars.map((v, i) => (
                <div
                  key={i}
                  style={{ height: `${Math.max(8, v * 100)}%` }}
                  className="w-[4px] rounded-full bg-[#1e427b] transition-[height] duration-75 ease-linear sm:w-[5px]"
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
                <span className="font-mono text-xl font-semibold tabular-nums tracking-tight text-qi-fg sm:text-2xl">
                  {fmt(elapsed)}
                </span>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-red-600 active:scale-95 sm:px-5 sm:text-sm"
                aria-label="Stop recording"
              >
                <StopIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Stop
              </button>
            </div>
            <p className="text-center text-[10px] text-qi-muted/75 sm:text-[11px]">
              Maximum 20 minutes per recording
            </p>
          </div>
        )}

        {/* Stopped — preview */}
        {recState === 'stopped' && audioResult && (
          <div className="space-y-2 py-0.5">
            <div className="flex flex-wrap items-center gap-2 text-emerald-600">
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              <span className="text-xs font-medium sm:text-sm">
                Saved — {fmt(audioResult.duration)}
              </span>
            </div>
            <audio
              ref={previewAudioRef}
              key={audioResult.url}
              src={audioResult.url}
              controls
              preload="metadata"
              className="w-full max-w-full rounded-lg"
            />
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={reRecord}
                className="inline-flex min-h-9 items-center gap-1 rounded-full border border-black/[0.12] bg-white/70 px-4 py-2 text-xs font-medium text-qi-fg transition hover:bg-white sm:text-sm"
              >
                ↺ Re-record
              </button>
              <button
                type="button"
                onClick={() => onSubmit(audioResult.base64, audioResult.mimeType)}
                disabled={submitStatus === 'submitting'}
                className="header-pill inline-flex min-h-9 items-center justify-center rounded-full px-5 py-2 text-xs font-medium text-qi-fg transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                {submitStatus === 'submitting' ? 'Submitting…' : 'Submit recording →'}
              </button>
            </div>
            {submitStatus === 'error' && submitError && (
              <p className="text-center text-xs text-red-700 sm:text-sm" role="alert">
                {submitError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Question reference script ── */}
      <div className="support-memo-panel p-6 sm:p-8">
        <h3 className="mb-1 font-display text-base font-semibold text-qi-fg">
          Question reference
        </h3>
        <p className="mb-5 text-xs leading-relaxed text-qi-muted">
          Work through these topics while recording. No specific order required — cover what feels relevant.
        </p>
        <div className="space-y-5">
          {SECTIONS.slice(1).map((sec, si) => (
            <div key={si}>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1e427b]">
                {sec.title}
              </div>
              <ul className="space-y-1.5">
                {sec.fields
                  .filter((f) => f.id !== 'consent')
                  .map((field) => (
                    <li
                      key={field.id}
                      className="flex gap-2 text-[12px] leading-snug text-qi-fg/80"
                    >
                      <span className="mt-px shrink-0 text-qi-muted">·</span>
                      <span>{field.label}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ConsultationPage() {
  // basics first → mode-select holds toggle + live typed form OR audio recorder
  const [phase, setPhase] = useState<'basics' | 'mode-select'>('basics')
  const [discoveryMode, setDiscoveryMode] = useState<'form' | 'audio'>('form')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [toolRows, setToolRows] = useState<ToolRow[]>([
    { name: '', purpose: '', cost: '', feedback: '' },
  ])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const topRef = useRef<HTMLDivElement>(null)
  const hpRef = useRef<HTMLInputElement>(null)

  const section = SECTIONS[step]!
  const total = SECTIONS.length
  const inTypedDiscovery = phase === 'mode-select' && discoveryMode === 'form'
  const isLast = inTypedDiscovery && step === total - 1
  const pct = Math.round(((step + 1) / total) * 100)

  function setAnswer(id: string, val: string) {
    setAnswers((prev) => ({ ...prev, [id]: val }))
    setValidationErrors((prev) => prev.filter((e) => !e.includes(id)))
  }

  function validateStep(): string[] {
    const errs: string[] = []
    for (const field of section.fields) {
      if (!field.required) continue
      const val = (answers[field.id] || '').trim()
      if (!val) errs.push(`"${field.label}" is required.`)
    }
    return errs
  }

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleNext() {
    const errs = validateStep()
    if (errs.length > 0) {
      setValidationErrors(errs)
      scrollTop()
      return
    }
    setValidationErrors([])
    if (phase === 'basics') {
      setPhase('mode-select')
      setStep(1)
      setDiscoveryMode('form')
    } else if (inTypedDiscovery) {
      setStep((s) => s + 1)
    }
    scrollTop()
  }

  function handleBack() {
    setValidationErrors([])
    if (phase === 'mode-select' && discoveryMode === 'form' && step === 1) {
      setPhase('basics')
      setStep(0)
    } else if (phase === 'mode-select' && discoveryMode === 'form' && step > 1) {
      setStep((s) => s - 1)
    }
    scrollTop()
  }

  async function handleAudioSubmit(audioBase64: string, mimeType: string) {
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch(AUDIO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: answers['contactName'] || '',
          contactEmail: answers['contactEmail'] || '',
          answers,
          audioBase64,
          mimeType,
          honeypot: hpRef.current?.value ?? '',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateStep()
    if (errs.length > 0) {
      setValidationErrors(errs)
      scrollTop()
      return
    }
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: answers['contactName'] || '',
          contactEmail: answers['contactEmail'] || '',
          answers,
          toolRows,
          honeypot: hpRef.current?.value ?? '',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div className="relative min-h-[var(--qi-vh-fill)] bg-qi-bg font-sans text-qi-fg">
      <Seo
        title="Discovery form"
        description="Complete ARK Solutions' Discovery form online — business basics first, then typed sections or a voice recording with AI transcript, or download a PDF. Help us understand your business so we can build the right solution."
        path="/consultation"
      />

      {/* ── Print-only view ── */}
      <div className="hidden print:block print:p-[14mm]">
        <PrintView answers={answers} toolRows={toolRows} />
      </div>

      {/* ── Screen UI ── */}
      <div className="print:hidden">
        <div className="qi-backdrop" aria-hidden />
        <div className="qi-grid" aria-hidden />

        {/* Header */}
        <header className="header-bar header-bar--elevated sticky top-0 z-50">
          <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-3 px-6 py-4 sm:gap-4 lg:px-10">
            <Link
              to="/"
              state={routeSlide.back}
              className="group ml-3 flex min-w-0 shrink flex-col items-center text-center leading-tight focus-visible:rounded-md sm:ml-5 lg:ml-6"
              aria-label={`${site.name}, home`}
              onClick={() => {
                playBookingTapSoundReverse()
              }}
            >
              <SiteHeaderBrand />
            </Link>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-qi-muted transition hover:text-qi-fg"
                aria-label="Download Discovery form — print or save as PDF"
              >
                <DownloadIcon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Download Discovery form</span>
              </button>
              <span className="select-none text-sm text-qi-muted/45" aria-hidden="true">
                |
              </span>
              <Link
                to="/"
                state={routeSlide.back}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-current px-3 py-2 text-sm font-medium text-qi-muted underline-offset-4 transition hover:text-qi-fg hover:underline"
                onClick={() => {
                  playBookingTapSoundReverse()
                }}
              >
                ← Back
              </Link>
            </div>
          </div>
        </header>

        <main
          className={`relative mx-auto px-6 py-10 sm:py-14 lg:px-8 ${
            phase === 'basics' && step === 0 ? 'max-w-6xl' : 'max-w-3xl'
          }`}
        >
          <div ref={topRef} className="scroll-anchor" aria-hidden="true" />

          {status === 'success' ? (
            /* ── Success ── */
            <div className="flex flex-col items-center gap-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
                <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.75" />
                  <path
                    d="M8 12.5l2.5 2.5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl">
                  Thank you.
                </h1>
                <p className="mt-4 mx-auto max-w-lg text-base leading-relaxed text-qi-muted sm:text-lg">
                  We received your Discovery form and sent a confirmation to your email. We'll review
                  your answers and follow up within 12–24 hours.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/"
                  state={routeSlide.back}
                  className="header-pill inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-qi-fg"
                  onClick={() => {
                    playBookingTapSoundReverse()
                  }}
                >
                  ← Back
                </Link>
                <Link
                  to={site.booking.path}
                  state={routeSlide.forward}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1e427b] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#2a5899]"
                  onClick={() => {
                    playBookingTapSound()
                  }}
                >
                  Book a call
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* ── Intro header ── */}
              <div
                className={`text-center ${phase === 'mode-select' ? 'mb-3 sm:mb-4' : 'mb-10'}`}
              >
                <h1 className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl">
                  {site.consultation.title}
                </h1>
                <p
                  className={`mx-auto max-w-xl text-base leading-relaxed text-qi-muted sm:text-lg ${
                    phase === 'mode-select' ? 'mt-2' : 'mt-3'
                  }`}
                >
                  {site.consultation.subtitle}
                </p>
              </div>

              {/* ── After basics: toggle + typed form or audio (same phase) ── */}
              {phase === 'mode-select' && (
                <div className="mb-8 space-y-8">
                  <DiscoveryModeToggle
                    mode={discoveryMode}
                    onModeChange={(m) => {
                      setDiscoveryMode(m)
                      scrollTop()
                    }}
                    onBackToBasics={() => {
                      setPhase('basics')
                      setStep(0)
                      scrollTop()
                    }}
                    showBackLink
                  />

                  {discoveryMode === 'audio' && (
                    <AudioRecorder
                      onSubmit={handleAudioSubmit}
                      onBack={() => {
                        setDiscoveryMode('form')
                        scrollTop()
                      }}
                      submitStatus={
                        status === 'submitting' ? 'submitting' : status === 'error' ? 'error' : 'idle'
                      }
                      submitError={errorMsg}
                    />
                  )}
                </div>
              )}

              {/* ── Progress bar (typed discovery only) ── */}
              {inTypedDiscovery && (
                <div className="mb-8">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-qi-muted">
                      Section {step + 1} of {total}
                    </span>
                    <span className="text-xs text-qi-muted">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#1e427b] transition-all duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              )}

              {/* ── Section form (basics + typed discovery) ── */}
              {(phase === 'basics' || inTypedDiscovery) && (
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot */}
                <input
                  ref={hpRef}
                  type="text"
                  name="company_verify"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute h-px w-px -translate-x-[9999px] opacity-0"
                  aria-hidden="true"
                />

                <div
                  className={`support-memo-panel ${
                    section.layout === 'basics-wide'
                      ? 'p-6 sm:p-8 sm:px-10 lg:px-12 lg:py-10'
                      : 'p-6 sm:p-8'
                  }`}
                  role="region"
                  aria-label={section.title}
                >
                  {/* Section heading */}
                  <div className="mb-6">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-qi-fg sm:text-2xl">
                      {section.title}
                    </h2>
                    {section.subtitle && (
                      <p className="mt-2 text-sm leading-relaxed text-qi-muted">
                        {section.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Validation errors */}
                  {validationErrors.length > 0 && (
                    <div
                      className="mb-6 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3"
                      role="alert"
                    >
                      {validationErrors.map((err, i) => (
                        <p key={i} className="text-sm text-red-700">
                          {err}
                        </p>
                      ))}
                    </div>
                  )}

                  {section.layout === 'basics-wide' ? (
                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                      {section.includeToolRows && (
                        <div className="sm:col-span-2">
                          <ToolRowsInput rows={toolRows} onChange={setToolRows} />
                        </div>
                      )}
                      {section.fields.map((field) => {
                        const fullRow =
                          field.type === 'radio' ||
                          field.type === 'checkbox' ||
                          field.type === 'textarea'
                        return (
                          <div key={field.id} className={fullRow ? 'sm:col-span-2' : undefined}>
                            <FieldInput
                              field={field}
                              value={answers[field.id] || ''}
                              onChange={(v) => setAnswer(field.id, v)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="space-y-5 sm:space-y-6">
                      {section.includeToolRows && (
                        <ToolRowsInput rows={toolRows} onChange={setToolRows} />
                      )}
                      {section.fields.map((field) => (
                        <FieldInput
                          key={field.id}
                          field={field}
                          value={answers[field.id] || ''}
                          onChange={(v) => setAnswer(field.id, v)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit-level error */}
                {status === 'error' && errorMsg && (
                  <p className="mt-4 text-sm text-red-700" role="alert">
                    {errorMsg}
                  </p>
                )}

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={phase === 'basics' && step === 0}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-black/[0.12] bg-white/70 px-6 py-3 text-sm font-medium text-qi-fg transition hover:bg-white disabled:pointer-events-none disabled:opacity-30"
                  >
                    ← Previous
                  </button>

                  {isLast ? (
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="header-pill inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-qi-fg transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === 'submitting' ? 'Submitting…' : 'Submit Discovery form'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="header-pill inline-flex min-h-11 items-center gap-2 rounded-full px-8 py-3 text-sm font-medium text-qi-fg transition hover:opacity-90"
                    >
                      {phase === 'basics' ? 'Continue →' : 'Next →'}
                    </button>
                  )}
                </div>

                {/* Section jump dots — typed discovery (steps 1+) */}
                {inTypedDiscovery && (
                  <div className="mt-6 flex flex-wrap justify-center gap-1.5" aria-hidden="true">
                    {SECTIONS.slice(1).map((_, idx) => {
                      const i = idx + 1
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setValidationErrors([])
                            setStep(i)
                            scrollTop()
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === step
                              ? 'w-6 bg-[#1e427b]'
                              : i < step
                                ? 'w-2 bg-[#1e427b]/40'
                                : 'w-2 bg-black/[0.1]'
                          }`}
                          aria-label={`Jump to section ${i + 1}`}
                        />
                      )
                    })}
                  </div>
                )}
              </form>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
