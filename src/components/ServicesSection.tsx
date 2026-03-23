import { site } from '../content/site'
import { Reveal } from './Reveal'

export function ServicesSection() {
  const { services } = site
  const [primary, secondary] = services.cards
  const intel = services.intelligenceCard

  return (
    <section
      className="relative py-28 sm:py-36 lg:py-44"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        {/* Hash target outside Reveal — motion transform on first paint breaks first scrollIntoView */}
        <div id={services.id} className="scroll-anchor" aria-hidden="true" />
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
                <span className="inline-flex items-center justify-center rounded-full border border-qi-accent/35 bg-[color-mix(in_oklab,var(--color-qi-accent)_12%,transparent)] px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.2em] text-qi-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] backdrop-blur-sm">
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
                <span className="inline-flex items-center justify-center rounded-full border border-qi-accent/35 bg-[color-mix(in_oklab,var(--color-qi-accent)_12%,transparent)] px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.2em] text-qi-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] backdrop-blur-sm">
                  {secondary.label}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-qi-fg sm:text-2xl">
                  {secondary.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-qi-muted">{secondary.subtitle}</p>
                <p className="mt-5 text-sm leading-[1.75] text-qi-muted sm:text-base sm:leading-[1.8]">
                  {secondary.body}
                </p>

                {/* Same gradient as Core offering — 2px + inline bg so the hairline can’t disappear on glass-subtle (1px + low contrast read as “nothing”) */}
                <div
                  aria-hidden
                  className="relative z-10 mt-10 block h-[2px] w-full max-h-[2px] min-h-[2px] shrink-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--color-qi-accent) 45%, transparent) 15%, color-mix(in oklab, var(--color-qi-accent) 45%, transparent) 85%, transparent 100%)',
                  }}
                />
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

          <Reveal variant="slide-left" delay={0.28} className="lg:col-span-5">
            <article className="group relative overflow-hidden rounded-qi-card glass glass-float">
              <div className="relative p-[2.662rem] sm:p-[3.3275rem] lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-[3.3275rem] lg:px-[3.3275rem] lg:py-[2.995rem] xl:gap-[3.993rem]">
                <div className="lg:col-span-7">
                  <span className="inline-flex items-center justify-center rounded-full border border-qi-accent/35 bg-[color-mix(in_oklab,var(--color-qi-accent)_12%,transparent)] px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.2em] text-qi-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] backdrop-blur-sm">
                    {intel.label}
                  </span>
                  <h3 className="mt-[1.66375rem] font-display text-2xl font-semibold text-qi-fg sm:mt-[1.9965rem] sm:text-3xl">
                    {intel.title}
                  </h3>
                  <p className="mt-[0.99825rem] text-sm font-medium text-qi-muted sm:text-base">{intel.tagline}</p>
                  <p className="mt-[1.331rem] max-w-xl text-sm leading-[1.75] text-qi-muted sm:mt-[1.66375rem] sm:text-base sm:leading-[1.8]">
                    {intel.intro}
                  </p>
                </div>

                <div className="relative mt-[3.3275rem] border-t border-black/[0.06] pt-[3.3275rem] lg:col-span-5 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:border-t-0 lg:pl-0 lg:pt-0">
                  {/* Centered in grid gap — matches horizontal .services-card-divider fade */}
                  <div
                    className="services-card-divider-vertical pointer-events-none absolute top-[15%] bottom-[15%] z-0 hidden w-px lg:left-[calc(-3.3275rem/2)] lg:block lg:-translate-x-1/2 xl:left-[calc(-3.993rem/2)]"
                    aria-hidden
                  />
                  <p className="relative z-10 text-[12.1px] font-semibold uppercase leading-none tracking-[0.2em] text-qi-accent">
                    {intel.doesHeading}
                  </p>
                  <ul className="relative z-10 mt-[1.331rem] space-y-[0.99825rem]">
                    {intel.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-qi-fg/90 sm:text-base"
                      >
                        <span className="accent-dot mt-2" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
