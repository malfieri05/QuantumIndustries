import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { routeSlide } from '../lib/routeTransitions'
import { Reveal, RevealStagger } from './Reveal'

export function ProcessSection() {
  const { process } = site

  return (
    <section
      id={process.id}
      className="relative py-28 sm:py-36 lg:py-44"
      aria-labelledby="process-heading"
    >
      <div className="section-hairline mx-auto max-w-5xl opacity-80" />

      <div className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        <Reveal>
          <h2
            id="process-heading"
            className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
          >
            {process.title}
          </h2>
        </Reveal>

        <RevealStagger className="mt-16 grid gap-6 divide-y divide-[color-mix(in_oklab,var(--color-qi-accent)_22%,transparent)] sm:mt-20 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch lg:gap-x-0 lg:divide-y-0">
          {process.steps.flatMap((step, index) => {
            const card = (
              <article
                key={step.title}
                className="process-step-card group relative mx-auto flex aspect-[4/5] w-full max-w-[285px] flex-col items-center justify-start gap-4 self-start rounded-qi-card border border-qi-accent/40 glass glass-float p-6 text-center sm:max-w-[308px] sm:gap-5 sm:p-8 lg:max-w-[322px]"
              >
                <div className="flex w-full flex-col items-center gap-2 sm:gap-2.5">
                  <span
                    className="mt-2 inline-grid size-14 shrink-0 place-items-center rounded-full border border-qi-accent/15 bg-[color-mix(in_oklab,var(--color-qi-accent)_14%,transparent)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55)] backdrop-blur-md sm:mt-2.5 sm:size-16"
                  >
                    <span className="font-sans text-xl font-semibold leading-none tabular-nums tracking-normal text-qi-accent sm:text-2xl">
                      {index + 1}
                    </span>
                  </span>
                  <h3 className="-mt-0.5 flex min-h-[3.25rem] w-full items-center justify-center font-display text-xl font-semibold leading-tight text-qi-fg sm:-mt-1 sm:min-h-[3.75rem] sm:text-2xl">
                    {step.title}
                  </h3>
                </div>
                <p className="w-full flex-1 text-sm leading-[1.75] text-qi-muted sm:text-base sm:leading-[1.8]">
                  {step.body}
                </p>
                {index === 0 && (
                  <Link
                    to={site.booking.path}
                    state={routeSlide.forward}
                    className="mt-auto inline-flex shrink-0 items-center justify-center rounded-full border border-qi-accent bg-transparent px-3.5 py-1.5 text-xs font-medium text-qi-accent transition-colors hover:bg-[color-mix(in_oklab,var(--color-qi-accent)_10%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qi-accent/70"
                  >
                    Book Now
                  </Link>
                )}
              </article>
            )

            if (index >= 2) {
              return [card]
            }

            const connector = (
              <div
                key={`process-connector-${index}`}
                className="hidden min-h-0 min-w-[2.75rem] lg:flex lg:h-full lg:min-h-0 lg:shrink-0 lg:self-stretch lg:items-center lg:justify-center"
                aria-hidden
              >
                <div className="pointer-events-none w-[min(100%,4.5rem)] sm:w-[min(100%,5rem)]">
                  <div className="process-step-connector-line" />
                </div>
              </div>
            )

            return [card, connector]
          })}
        </RevealStagger>
      </div>
    </section>
  )
}
