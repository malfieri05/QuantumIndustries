import { useEffect, useRef } from 'react'
import { getCalendlyUrl } from '../lib/calendly'
import { loadCalendlyScript } from '../lib/calendlyScript'

type CalendlyInlineProps = {
  className?: string
}

/** Inline Calendly embed (Official widget.js + initInlineWidget). */
export function CalendlyInline({ className = '' }: CalendlyInlineProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const url = getCalendlyUrl()

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
      .catch(() => {
        /* optional: surface error UI via parent */
      })

    return () => {
      cancelled = true
      el.replaceChildren()
    }
  }, [url])

  if (!url) {
    return (
      <div
        className={`flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center ${className}`.trim()}
      >
        <p className="text-sm font-medium text-slate-700">Calendly URL not configured</p>
        <p className="mt-2 max-w-md text-xs text-slate-500">
          Add <code className="rounded bg-slate-200 px-1 py-0.5 font-mono">VITE_CALENDLY_URL</code> to your{' '}
          <code className="rounded bg-slate-200 px-1 py-0.5 font-mono">.env</code> file.
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
