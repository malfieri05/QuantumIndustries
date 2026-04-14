import { Link } from 'react-router-dom'
import { CalcomEmbed } from '../components/CalcomEmbed'
import { Reveal } from '../components/Reveal'
import { SiteHeaderBrand } from '../components/SiteHeaderBrand'
import { site } from '../content/site'
import { playBookingTapSoundReverse } from '../lib/bookingTapSound'
import { routeSlide } from '../lib/routeTransitions'

export function BookingPage() {
  const { booking } = site

  return (
    <div className="relative min-h-[var(--qi-vh-fill)] bg-qi-bg font-sans text-qi-fg">
      <div className="qi-backdrop" aria-hidden />
      <div className="qi-grid" aria-hidden />

      <header className="header-bar header-bar--elevated sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-3 px-6 py-4 sm:gap-4 lg:px-10">
          <Link
            to="/"
            className="group ml-3 flex min-w-0 shrink flex-col items-center text-center leading-tight focus-visible:rounded-md sm:ml-5 lg:ml-6"
            aria-label={`${site.name}, home`}
          >
            <SiteHeaderBrand />
          </Link>
          <Link
            to="/"
            state={routeSlide.back}
            className="-mr-2 inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-2 text-sm font-medium text-qi-muted underline-offset-4 transition hover:text-qi-fg hover:underline"
            onClick={() => {
              playBookingTapSoundReverse()
            }}
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
    </div>
  )
}
