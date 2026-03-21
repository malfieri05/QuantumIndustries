import { Link } from 'react-router-dom'
import { CalendlyInline } from '../components/CalendlyInline'
import { site } from '../content/site'

export function BookingPage() {
  const { booking, name, tagline } = site

  return (
    <div className="relative min-h-svh bg-qi-bg font-sans text-qi-fg">
      <div className="qi-backdrop" aria-hidden />
      <div className="qi-grid" aria-hidden />

      <header className="glass-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-5 lg:px-8">
          <Link to="/" className="group flex flex-col leading-tight focus-visible:rounded-md">
            <span className="font-display text-base font-semibold tracking-tight text-qi-fg transition sm:text-lg">
              {name}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-qi-muted sm:text-[11px]">
              {tagline}
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-qi-muted underline-offset-4 transition hover:text-qi-fg hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h1 className="text-center font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl">
          {booking.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-base leading-[1.75] text-qi-muted sm:text-lg sm:leading-[1.8]">
          {booking.subtitle}
        </p>

        <div className="mt-12 overflow-x-auto [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]">
          <CalendlyInline />
        </div>
      </div>
    </div>
  )
}
