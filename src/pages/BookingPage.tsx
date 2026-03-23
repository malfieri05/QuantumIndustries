import { Link } from 'react-router-dom'
import { CalcomEmbed } from '../components/CalcomEmbed'
import { Reveal } from '../components/Reveal'
import { site } from '../content/site'
import { useMdUp } from '../hooks/useMdUp'
import { routeSlide } from '../lib/routeTransitions'

export function BookingPage() {
  const { booking, name, tagline } = site
  const mdUp = useMdUp()

  return (
    <div className="relative min-h-svh bg-qi-bg font-sans text-qi-fg">
      <div className="qi-backdrop" aria-hidden />
      <div className="qi-grid" aria-hidden />

      <header className="header-bar header-bar--elevated sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-3 px-6 py-4 sm:gap-4 lg:px-10">
          <Link
            to="/"
            className="group flex min-w-0 shrink flex-col items-center text-center leading-tight focus-visible:rounded-md"
          >
            <span className="font-display text-base font-semibold tracking-tight text-qi-fg transition sm:text-lg">
              {name}
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-qi-muted sm:text-[11px]">
              {tagline}
            </span>
          </Link>
          <Link
            to="/"
            state={routeSlide.back}
            className="-mr-2 inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-2 text-sm font-medium text-qi-muted underline-offset-4 transition hover:text-qi-fg hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-10">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl">
            {booking.title}
          </h1>
          <p className="mt-4 w-full text-base leading-[1.75] text-qi-muted sm:text-lg sm:leading-[1.8]">
            {booking.subtitle}
          </p>
        </Reveal>

        <Reveal className="mt-12 overflow-x-auto [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]" delay={0.12}>
          <div className="relative overflow-hidden rounded-qi-card glass glass-float p-4 sm:p-6">
            <CalcomEmbed />
          </div>
        </Reveal>
      </div>

      <Link
        to="/"
        state={routeSlide.back}
        aria-label={`${name} — home`}
        className="fixed bottom-5 right-5 z-40 inline-flex rounded-lg p-1 ring-offset-qi-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qi-accent/70 sm:bottom-6 sm:right-6"
      >
        <img
          src="/coreNOBACKGROUND.png"
          alt=""
          className="h-auto w-auto max-h-16 origin-bottom-right scale-90 object-contain opacity-90 sm:max-h-20"
          decoding="async"
          loading={mdUp ? 'lazy' : 'eager'}
        />
      </Link>
    </div>
  )
}
