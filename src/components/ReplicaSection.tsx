import { site } from '../content/site'

export function ReplicaSection() {
  const { replica } = site
  return (
    <section
      id={replica.id}
      className="relative py-20 sm:py-24"
      aria-labelledby="replica-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2
            id="replica-heading"
            className="font-display text-3xl font-bold tracking-tight text-qi-fg sm:text-4xl"
          >
            {replica.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-qi-muted sm:text-lg">{replica.lead}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {replica.bullets.map((text, i) => (
            <li
              key={text}
              className="flex gap-4 rounded-xl border border-white/[0.07] bg-qi-elevated/40 p-5 backdrop-blur-sm"
            >
              <span className="font-display text-lg font-semibold tabular-nums text-qi-accent/90">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed text-qi-fg/90 sm:text-base">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
