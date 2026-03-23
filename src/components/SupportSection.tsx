import { site } from '../content/site'
import { Reveal } from './Reveal'

export function SupportSection() {
  const { support } = site

  return (
    <section
      className="relative pt-28 pb-[10.5rem] sm:pt-36 sm:pb-[13.5rem] lg:pt-44 lg:pb-[16.5rem]"
      aria-labelledby="support-heading"
    >
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        <div id={support.id} className="scroll-anchor" aria-hidden="true" />
        <Reveal>
          <h2
            id="support-heading"
            className="font-display text-3xl font-semibold tracking-tight text-qi-fg sm:text-4xl md:text-5xl"
          >
            {support.title}
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <div
            className="support-memo-panel mt-14 sm:mt-20 sm:mx-6 md:mx-14"
            role="region"
            aria-labelledby="support-memo-intro"
          >
            <h3
              id="support-memo-intro"
              className="font-display text-xl font-semibold leading-tight text-qi-fg sm:text-2xl"
            >
              {support.closing}
            </h3>
            <ul className="mt-6 space-y-4 sm:mt-8">
              {[support.body, support.bodySecond].map((item) => (
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
        </Reveal>
      </div>
    </section>
  )
}
