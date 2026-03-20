import { useBooking } from '../context/BookingContext'
import { getCalendlyUrl } from '../lib/calendly'

const baseClass =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ' +
  'bg-qi-accent text-qi-bg shadow-[0_0_24px_-4px_rgba(34,211,238,0.55)] hover:shadow-[0_0_32px_-2px_rgba(34,211,238,0.65)] hover:brightness-110 active:scale-[0.98]'

type ConsultationCtaProps = {
  className?: string
  children?: string
}

export function ConsultationCta({
  className = '',
  children = 'Book Free Consultation',
}: ConsultationCtaProps) {
  const url = getCalendlyUrl()
  const { open } = useBooking()

  if (url) {
    return (
      <button type="button" onClick={open} className={`${baseClass} ${className}`.trim()}>
        {children}
      </button>
    )
  }

  return (
    <div className={`flex max-w-md flex-col gap-2 ${className}`.trim()}>
      <span
        className={`${baseClass} pointer-events-none cursor-not-allowed opacity-50 grayscale`}
        aria-disabled="true"
      >
        {children}
      </span>
      <p className="text-xs leading-relaxed text-amber-200/90">
        Set <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">VITE_CALENDLY_URL</code> in
        your <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">.env</code> file (see{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">.env.example</code>).
      </p>
    </div>
  )
}
