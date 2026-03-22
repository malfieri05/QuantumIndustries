import { site } from '../content/site'
import { Reveal } from './Reveal'

export function SupportSection() {
  const { support } = site

  return (
    <section
      id={support.id}
      className="relative py-28 sm:py-36 lg:py-44"
      aria-labelledby="support-heading"
    >
      <div className="section-hairline mx-auto max-w-5xl opacity-80" />

      <div className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        <Reveal>
          <h2
            id="support-heading"
            className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
          >
            {support.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-[1.75] text-qi-muted sm:mt-8 sm:text-lg sm:leading-[1.8]">
            {support.body}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-qi-muted sm:mt-5 sm:text-lg sm:leading-[1.8]">
            {support.closing}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
