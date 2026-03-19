import { site } from '../content/site'

export function ServicesSection() {
  const { services } = site
  return (
    <section
      id={services.id}
      className="border-t border-white/[0.06] bg-qi-surface/40 py-20 sm:py-24"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          id="services-heading"
          className="font-display text-3xl font-bold tracking-tight text-qi-fg sm:text-4xl"
        >
          {services.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-qi-muted sm:text-lg">
          {services.intro}
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {services.cards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-qi-elevated/60 p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition hover:border-qi-accent/25"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-qi-accent/10 blur-3xl transition group-hover:bg-qi-accent/15" />
              <h3 className="relative font-display text-xl font-semibold text-qi-fg">{card.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-qi-muted sm:text-base">
                {card.body}
              </p>
              <ul className="relative mt-6 space-y-2 border-t border-white/[0.06] pt-6">
                {card.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-qi-fg/90">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-qi-accent shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
