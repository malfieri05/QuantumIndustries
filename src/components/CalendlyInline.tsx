import { useEffect, useRef } from 'react'
import { getCalendlyUrl } from '../lib/calendly'
import { loadCalendlyScript } from '../lib/calendlyScript'

type CalendlyInlineProps = {
  className?: string
}

/** Matches main site palette: qi-surface bg, qi-fg text, qi-accent CTAs (Calendly embed params). */
function buildEmbedUrl(base: string): string {
  const clean = base.split('?')[0]
  const params = new URLSearchParams({
    hide_gdpr_banner: '1',
    background_color: '0f131a',
    text_color: 'f3f5f7',
    primary_color: '3b5fff',
  })
  return `${clean}?${params.toString()}`
}

/** Inline Calendly embed via official widget API. */
export function CalendlyInline({ className = '' }: CalendlyInlineProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const baseUrl = getCalendlyUrl()
  const url = baseUrl ? buildEmbedUrl(baseUrl) : undefined

  useEffect(() => {
    if (!url || !parentRef.current) return

    const el = parentRef.current
    el.replaceChildren()

    let cancelled = false

    void loadCalendlyScript()
      .then(() => {
        if (cancelled || !parentRef.current) return
        window.Calendly?.initInlineWidget({
          url,
          parentElement: parentRef.current,
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      el.replaceChildren()
    }
  }, [url])

  if (!baseUrl) {
    return (
      <div
        className={`flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-12 text-center ${className}`.trim()}
      >
        <p className="text-sm font-medium text-qi-fg">Calendly URL not configured</p>
        <p className="mt-2 max-w-md text-xs text-qi-muted">
          Add <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">VITE_CALENDLY_URL</code> to
          your <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">.env</code> file.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className={`calendly-inline-embed min-h-[700px] w-full min-w-full lg:min-w-[1100px] ${className}`.trim()}
      aria-label="Calendly scheduling"
    />
  )
}
