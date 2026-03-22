import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { routeSlide } from '../lib/routeTransitions'

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
  const sizeClass = size === 'sm'
    ? '!px-5 !py-2.5 !text-xs !rounded-full'
    : ''

  return (
    <Link
      to={site.booking.path}
      state={routeSlide.forward}
      className={`btn-primary ${sizeClass} ${className}`.trim()}
    >
      {children}
    </Link>
  )
}
