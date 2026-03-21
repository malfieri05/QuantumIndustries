import { site } from '../content/site'
import { Reveal } from './Reveal'

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

        <div className="mt-16 grid gap-6 sm:mt-20 sm:gap-8 lg:grid-cols-3">
          {process.steps.map((step, index) => (
            <Reveal key={step.title} delay={0.08 + index * 0.1} className="h-full">
              <article
                className="group relative flex h-full flex-col rounded-2xl glass p-8 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-2 hover:border-white/[0.14] hover:shadow-[0_28px_56px_-20px_rgba(0,0,0,0.72)] sm:p-10"
              >
                <span
                  className="font-display text-4xl font-semibold tracking-tight text-qi-muted/25 sm:text-5xl"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-qi-fg sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-[1.75] text-qi-muted sm:text-base sm:leading-[1.8]">
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
