import { site } from '../content/site'
import { ConsultationCta } from './ConsultationCta'

export function ProcessSection() {
  const { consultation } = site
  return (
    <section
      id={consultation.id}
      className="border-t border-white/[0.06] bg-gradient-to-b from-qi-surface/30 to-qi-bg py-20 sm:py-24"
      aria-labelledby="consult-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          id="consult-heading"
          className="font-display text-3xl font-bold tracking-tight text-qi-fg sm:text-4xl"
        >
          {consultation.title}
        </h2>
        <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-qi-violet/90">
          {consultation.subtitle}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-qi-muted sm:text-lg">
          {consultation.intro}
        </p>

        <ol className="mt-14 space-y-6">
          {consultation.steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex gap-6 rounded-2xl border border-white/[0.07] bg-qi-bg/40 p-6 pl-8 sm:p-8"
            >
              <span
                className="absolute left-0 top-8 hidden h-px w-4 bg-gradient-to-r from-qi-accent to-transparent sm:block"
                aria-hidden
              />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-qi-accent/30 bg-qi-accent/10 font-display text-sm font-bold text-qi-accent-soft">
                {index + 1}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-qi-fg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-qi-muted sm:text-base">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-qi-muted sm:text-base">
          {consultation.closing}
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <ConsultationCta />
          <span className="text-xs text-qi-muted">No obligation — book a time that works for you.</span>
        </div>
      </div>
    </section>
  )
}
