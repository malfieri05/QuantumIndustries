import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { ConsultationCta } from './ConsultationCta'

export function Hero() {
  return (
    <section
      className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-qi-accent/50 to-transparent" />

      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-qi-accent sm:text-sm">
        {site.hero.eyebrow}
      </p>

      <h1
        id="hero-heading"
        className="font-display text-center text-4xl font-bold leading-[1.05] tracking-tight text-qi-fg sm:text-6xl md:text-7xl"
      >
        <span className="bg-gradient-to-br from-qi-fg via-qi-accent-soft to-qi-violet bg-clip-text text-transparent">
          {site.hero.headline}
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-qi-muted sm:text-lg">
        {site.hero.subhead}
      </p>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm text-qi-muted/90 sm:text-base">
        {site.hero.supporting}
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <ConsultationCta />
        <Link
          to="/#services"
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-qi-fg transition hover:border-qi-accent/40 hover:bg-white/[0.06]"
        >
          Explore services
        </Link>
      </div>
    </section>
  )
}
