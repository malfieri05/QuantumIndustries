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
  const sizeClass =
    size === 'sm'
      ? '!px-5 !py-2.5 !text-xs !rounded-full'
      : '!px-[2.025rem] !py-[0.9rem] !text-[1.0125rem]'

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
