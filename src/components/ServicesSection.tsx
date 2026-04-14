import { useId } from 'react'
import { site } from '../content/site'
import { Reveal } from './Reveal'

const SUPERINTELLIGENCE_PHRASE = "'superintelligence'" as const

type SuperintelligenceTooltipCopy = {
  readonly heading: string
  readonly bullets: readonly string[]
}

function HighlightLine({
  text,
  tooltipId,
  tooltip,
}: {
  text: string
  tooltipId: string
  tooltip: SuperintelligenceTooltipCopy
}) {
  const lower = text.toLowerCase()
  const needleLower = SUPERINTELLIGENCE_PHRASE.toLowerCase()
  const idx = lower.indexOf(needleLower)
  if (idx === -1) {
    return <>{text}</>
  }
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + SUPERINTELLIGENCE_PHRASE.length)
  const after = text.slice(idx + SUPERINTELLIGENCE_PHRASE.length)
  return (
    <>
      {before}
      <span className="group/super relative inline">
        <button
          type="button"
          className="cursor-help border-0 bg-transparent p-0 font-inherit text-left text-qi-accent transition-colors hover:text-qi-accent/90 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qi-accent/50"
          aria-describedby={tooltipId}
        >
          {match}
        </button>
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none invisible absolute bottom-full left-0 z-30 mb-2 w-[min(22rem,calc(100vw-2rem))] max-h-[min(16rem,45vh)] -translate-y-1 overflow-y-auto rounded-xl border border-qi-accent bg-qi-elevated/98 px-3 py-2.5 text-left text-[12.5px] leading-relaxed text-qi-fg opacity-0 shadow-lg backdrop-blur-md transition-[opacity,transform,visibility] duration-200 ease-out group-hover/super:visible group-hover/super:translate-y-0 group-hover/super:opacity-100 group-focus-within/super:visible group-focus-within/super:translate-y-0 group-focus-within/super:opacity-100 sm:text-sm sm:leading-relaxed"
        >
          <span className="block font-semibold text-qi-fg">{tooltip.heading}</span>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 marker:text-qi-muted">
            {tooltip.bullets.map((line) => (
              <li key={line} className="pl-0.5 text-qi-fg/95">
                {line}
              </li>
            ))}
          </ul>
        </span>
      </span>
      {after}
    </>
  )
}

export function ServicesSection() {
  const { services } = site
  const [primary, secondary] = services.cards
  const intel = services.intelligenceCard
  const superTipId = useId()

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

        <div className="mt-14 grid gap-8 sm:mt-16 lg:mt-20 lg:grid-cols-5 lg:gap-10">
          <Reveal variant="slide-left" delay={0.1} className="lg:col-span-3">
            <article className="group relative h-full min-w-0 overflow-x-clip overflow-y-visible rounded-qi-card glass glass-float">
              <div className="relative p-6 sm:p-8 lg:p-11">
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
                      <span className="min-w-0">
                        <HighlightLine text={item} tooltipId={superTipId} tooltip={services.superintelligenceTooltip} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>

          <Reveal variant="slide-right" delay={0.2} className="lg:col-span-2 lg:mt-14">
            <article className="group relative h-full min-w-0 overflow-hidden rounded-qi-card glass-subtle glass-float">
              <div className="relative p-6 sm:p-8 lg:p-11">
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

                <div className="services-card-divider relative z-10 mt-10" aria-hidden />
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
            <article className="group relative min-w-0 overflow-hidden rounded-qi-card glass glass-float">
              <div className="relative p-6 sm:p-8 md:p-10 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-[3.3275rem] lg:p-[2.662rem] lg:px-[3.3275rem] lg:py-[2.995rem] xl:gap-[3.993rem]">
                <div className="min-w-0 lg:col-span-7">
                  <span className="inline-flex items-center justify-center rounded-full border border-qi-accent/35 bg-[color-mix(in_oklab,var(--color-qi-accent)_12%,transparent)] px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.2em] text-qi-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] backdrop-blur-sm">
                    {intel.label}
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-qi-fg sm:mt-[1.9965rem] sm:text-3xl lg:mt-[1.66375rem]">
                    {intel.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium text-qi-muted sm:mt-[0.99825rem] sm:text-base lg:mt-[0.99825rem]">
                    {intel.tagline}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-[1.75] text-qi-muted sm:mt-[1.331rem] sm:text-base sm:leading-[1.8] lg:mt-[1.331rem]">
                    {intel.intro}
                  </p>
                </div>

                <div className="relative mt-8 border-t border-black/[0.06] pt-8 sm:mt-10 sm:pt-10 lg:col-span-5 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:border-t-0 lg:pl-0 lg:pt-0">
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
