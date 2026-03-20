import { site } from '../content/site'
import { ConsultationCta } from './ConsultationCta'
import { Reveal } from './Reveal'

export function ProcessSection() {
  const { consultation } = site

  return (
    <section
      id={consultation.id}
      className="relative py-24 sm:py-32"
      aria-labelledby="consult-heading"
    >
      <div className="section-glow-line mx-auto max-w-5xl" />

      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr,1.2fr] lg:gap-20">
          {/* Left: sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-qi-accent-soft">
                {consultation.subtitle}
              </p>
              <h2
                id="consult-heading"
                className="mt-3 font-display text-3xl font-bold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
              >
                {consultation.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-qi-muted sm:text-lg">
                {consultation.intro}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-8 text-sm leading-relaxed text-qi-muted/80 sm:text-base">
                {consultation.closing}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ConsultationCta />
                <span className="text-xs text-qi-muted">
                  No obligation — book a time that works.
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right: staggered step cards with connecting line */}
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="pointer-events-none absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-qi-accent/20 via-qi-accent/10 to-transparent" aria-hidden />

            <ol className="space-y-6">
              {consultation.steps.map((step, index) => (
                <Reveal key={step.title} delay={0.1 + index * 0.12}>
                  <li className="group relative flex gap-6 pl-2">
                    {/* Step number */}
                    <div className="relative z-10">
                      <div className="step-number transition-all duration-300 group-hover:border-qi-accent/50 group-hover:bg-qi-accent/15 group-hover:shadow-[0_0_20px_-4px_rgba(37,99,235,0.3)]">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 rounded-2xl glass-subtle p-6 transition-all duration-300 group-hover:border-white/[0.1] sm:p-8">
                      <h3 className="font-display text-lg font-semibold text-qi-fg">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-qi-muted sm:text-base">
                        {step.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
