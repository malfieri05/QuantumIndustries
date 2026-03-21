import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { getCalendlyUrl } from '../lib/calendly'

type ConsultationCtaProps = {
  className?: string
  children?: string
  size?: 'default' | 'sm'
}

export function ConsultationCta({
  className = '',
  children = 'Book Consultation',
  size = 'default',
}: ConsultationCtaProps) {
  const url = getCalendlyUrl()

  const sizeClass = size === 'sm'
    ? '!px-5 !py-2.5 !text-xs !rounded-lg'
    : ''

  if (url) {
    return (
      <Link
        to={site.booking.path}
        className={`btn-primary ${sizeClass} ${className}`.trim()}
      >
        {children}
      </Link>
    )
  }

  return (
    <div className={`flex max-w-md flex-col gap-2 ${className}`.trim()}>
      <span
        className={`btn-primary pointer-events-none cursor-not-allowed opacity-40 grayscale ${sizeClass}`}
        aria-disabled="true"
      >
        {children}
      </span>
      <p className="text-xs leading-relaxed text-qi-muted">
        Set{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">
          VITE_CALENDLY_URL
        </code>{' '}
        in your{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.7rem]">.env</code>{' '}
        file.
      </p>
    </div>
  )
}
