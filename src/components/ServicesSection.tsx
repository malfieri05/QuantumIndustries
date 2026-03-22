import { site } from '../content/site'
import { Reveal } from './Reveal'

export function ServicesSection() {
  const { services } = site
  const [primary, secondary] = services.cards

  return (
    <section
      id={services.id}
      className="relative py-28 sm:py-36 lg:py-44"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        <Reveal>
          <h2
            id="services-heading"
            className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
          >
            {services.title}
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-8 lg:grid-cols-5 lg:gap-10">
          <Reveal variant="slide-left" delay={0.1} className="lg:col-span-3">
            <article className="group relative h-full overflow-hidden rounded-qi-card glass glass-float">
              <div className="relative p-8 sm:p-10 lg:p-11">
                <span className="inline-block rounded-full border border-qi-accent/35 bg-[color-mix(in_oklab,var(--color-qi-accent)_12%,transparent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-qi-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] backdrop-blur-sm">
                  {primary.label}
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold text-qi-fg sm:text-3xl">
                  {primary.title}
                </h3>
                <p className="mt-5 max-w-lg text-sm leading-[1.75] text-qi-muted sm:text-base sm:leading-[1.8]">
                  {primary.body}
                </p>

                <div className="services-card-divider mt-10" aria-hidden />
                <ul className="space-y-4 pt-10">
                  {primary.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-qi-fg/90 sm:text-base">
                      <span className="accent-dot mt-2" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>

          <Reveal variant="slide-right" delay={0.2} className="lg:col-span-2 lg:mt-14">
            <article className="group relative h-full overflow-hidden rounded-qi-card glass-subtle glass-float">
              <div className="relative p-8 sm:p-10 lg:p-11">
                <span className="inline-block rounded-full border border-qi-accent/35 bg-[color-mix(in_oklab,var(--color-qi-accent)_12%,transparent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-qi-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] backdrop-blur-sm">
                  {secondary.label}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-qi-fg sm:text-2xl">
                  {secondary.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-qi-muted">{secondary.subtitle}</p>
                <p className="mt-5 text-sm leading-[1.75] text-qi-muted sm:text-base sm:leading-[1.8]">
                  {secondary.body}
                </p>

                <div className="services-card-divider mt-10" aria-hidden />
                <ul className="space-y-4 pt-10">
                  {secondary.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-qi-fg/90 sm:text-base">
                      <span
                        className="mt-2 h-[5px] w-[5px] shrink-0 rounded-full bg-qi-muted opacity-70"
                        aria-hidden
                      />
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
