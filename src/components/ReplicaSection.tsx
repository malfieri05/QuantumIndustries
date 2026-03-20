import { site } from '../content/site'
import { Reveal } from './Reveal'

export function ReplicaSection() {
  const { replica } = site

  return (
    <section
      id={replica.id}
      className="relative py-24 sm:py-32"
      aria-labelledby="replica-heading"
    >
      <div className="section-glow-line mx-auto max-w-5xl" />

      {/* Full-width cinematic statement */}
      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl glass-strong glass-refraction">
          {/* Background glow elements */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-qi-accent/6 blur-[100px]" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-qi-violet/6 blur-[80px]" />

          <div className="relative px-8 py-16 sm:px-14 sm:py-20 lg:px-20 lg:py-24">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-qi-accent-soft">
                Replica Builds
              </p>
              <h2
                id="replica-heading"
                className="mt-4 font-display text-3xl font-bold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
              >
                {replica.lead}
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-6 max-w-xl font-display text-xl font-semibold text-qi-accent-soft sm:text-2xl">
                {replica.statement}
              </p>
            </Reveal>

            {/* Staggered bullet grid */}
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {replica.bullets.map((text, i) => (
                <Reveal key={text} delay={0.1 + i * 0.1}>
                  <div className="flex gap-4 rounded-xl bg-white/[0.02] p-5 border border-white/[0.04] transition-colors duration-300 hover:border-white/[0.08]">
                    <span className="font-display text-lg font-bold tabular-nums text-qi-accent/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-relaxed text-qi-fg/85 sm:text-base">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
