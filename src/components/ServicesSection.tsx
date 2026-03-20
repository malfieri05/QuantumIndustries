import { site } from '../content/site'
import { Reveal } from './Reveal'

export function ServicesSection() {
  const { services } = site
  const [primary, secondary] = services.cards

  return (
    <section
      id={services.id}
      className="relative py-24 sm:py-32"
      aria-labelledby="services-heading"
    >
      <div className="section-glow-line mx-auto max-w-5xl" />

      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-10">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-qi-accent-soft">
            Services
          </p>
          <h2
            id="services-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
          >
            {services.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-qi-muted sm:text-lg">
            {services.intro}
          </p>
        </Reveal>

        {/* Asymmetric card layout */}
        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          {/* Primary card — takes 3 cols, larger */}
          <Reveal variant="slide-left" delay={0.1} className="lg:col-span-3">
            <article className="glass-refraction group relative h-full overflow-hidden rounded-2xl glass transition-all duration-500 hover:border-qi-accent/20">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-qi-accent/8 blur-3xl transition-all duration-700 group-hover:bg-qi-accent/12 group-hover:scale-110" />

              <div className="relative p-8 sm:p-10">
                <span className="inline-block rounded-full bg-qi-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-qi-accent-soft">
                  {primary.label}
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-qi-fg sm:text-3xl">
                  {primary.title}
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-qi-muted sm:text-base">
                  {primary.body}
                </p>

                <ul className="mt-8 space-y-3 border-t border-white/[0.06] pt-8">
                  {primary.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-qi-fg/90 sm:text-base">
                      <span className="accent-dot mt-2" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>

          {/* Secondary card — takes 2 cols, offset vertically */}
          <Reveal variant="slide-right" delay={0.25} className="lg:col-span-2 lg:mt-12">
            <article className="glass-refraction group relative h-full overflow-hidden rounded-2xl glass transition-all duration-500 hover:border-qi-violet/20">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-qi-violet/8 blur-3xl transition-all duration-700 group-hover:bg-qi-violet/12 group-hover:scale-110" />

              <div className="relative p-8 sm:p-10">
                <span className="inline-block rounded-full bg-qi-violet/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-qi-violet-soft">
                  {secondary.label}
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-qi-fg sm:text-2xl">
                  {secondary.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-qi-violet-soft/80">
                  {secondary.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-qi-muted sm:text-base">
                  {secondary.body}
                </p>

                <ul className="mt-8 space-y-3 border-t border-white/[0.06] pt-8">
                  {secondary.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-qi-fg/90">
                      <span className="accent-dot mt-2" style={{ background: 'var(--color-qi-violet-soft)', boxShadow: '0 0 10px 2px rgba(167,139,250,0.4)' }} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
