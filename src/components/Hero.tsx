import type { CSSProperties } from 'react'
import { site } from '../content/site'
import { useHeroGyroscopeEnabled } from '../hooks/useHeroGyroscopeEnabled'
import { ConsultationCta } from './ConsultationCta'
import { HeroGyroscope } from './HeroGyroscope'
import { SectionDivider } from './SectionDivider'

function HeroGyroscopeGate() {
  const enabled = useHeroGyroscopeEnabled()
  if (!enabled) return null
  return <HeroGyroscope className="h-full w-full" />
}

const delay = (ms: number): CSSProperties =>
  ({ '--hero-enter-delay': `${ms}ms` }) as CSSProperties

/** Periods: geometric round dots at ~0.8em scale (20% smaller than body). */
function HeroHeadlinePeriods({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\.)/g).map((part, i) =>
        part === '.' ? (
          <span
            key={i}
            className="inline-block align-baseline text-[0.8em] leading-none"
          >
            <span className="sr-only">.</span>
            <span
              className="relative top-[0.06em] ms-[0.02em] inline-block h-[0.2em] w-[0.2em] shrink-0 rounded-full bg-current"
              aria-hidden
            />
          </span>
        ) : part ? (
          <span key={i}>{part}</span>
        ) : null,
      )}
    </>
  )
}

/** Shared with eyebrow / h1 / CTA on desktop (translate); mobile uses centered stack. */
const heroTextCol =
  'min-w-0 max-w-2xl md:translate-x-[10%] lg:max-w-[42rem]'

export function Hero() {
  const headlineLines = site.hero.headline.split('\n')
  const mobileLine1 = `${headlineLines[0]} ${headlineLines[1]}`
  const mobileLine2 = `${headlineLines[2]} ${headlineLines[3]}`

  return (
    <section
      id="home"
      className="relative mx-auto max-w-7xl flow-root px-6 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20"
      aria-labelledby="hero-heading"
    >
      {/*
        Mobile: flex column — eyebrow, headline (2 lines, centered), gyro, CTA.
        md+: grid — col1 rows 1–3 = eyebrow, h1, CTA; col2 row-span-3 = gyro (unchanged vs before).
      */}
      <div className="relative z-10 flex flex-col max-md:gap-6 md:grid md:min-h-0 md:grid-cols-2 md:items-center md:gap-x-8 lg:gap-x-10">
        <p
          className={`hero-enter mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-qi-muted max-md:mb-0 max-md:text-center sm:text-xs md:col-start-1 md:row-start-1 ${heroTextCol}`}
          style={delay(0)}
        >
          {site.hero.eyebrow}
        </p>

        <h1
          id="hero-heading"
          className={`hero-enter font-display text-[2.385rem] font-semibold leading-[1.02] tracking-[-0.02em] max-md:text-center sm:text-[3.375rem] md:col-start-1 md:row-start-2 md:text-[4.05rem] lg:text-[4.05rem] ${heroTextCol}`}
          style={delay(110)}
        >
          <span className="md:hidden">
            <span className="block text-qi-fg">
              <HeroHeadlinePeriods text={mobileLine1} />
            </span>
            <span className="mt-1 block text-qi-fg/92">
              <HeroHeadlinePeriods text={mobileLine2} />
            </span>
          </span>
          <span className="hidden md:block">
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {i === 0 ? (
                  <span className="text-qi-fg">
                    <HeroHeadlinePeriods text={line} />
                  </span>
                ) : (
                  <span className="mt-1 block text-qi-fg/92">
                    <HeroHeadlinePeriods text={line} />
                  </span>
                )}
              </span>
            ))}
          </span>
        </h1>

        {/* Gyroscope — mobile: between headline and CTA; md+: right column spanning all text rows. */}
        <div
          className="pointer-events-none relative mx-0 block w-full min-w-0 min-h-[280px] max-md:min-h-[300px] max-md:h-[min(340px,50svh)] max-md:overflow-x-clip justify-self-stretch md:col-start-2 md:row-span-3 md:row-start-1 md:min-h-0 md:h-[min(448px,62.4vh)] md:w-auto md:self-center md:-translate-x-[10%] md:[mask-image:linear-gradient(to_right,transparent_0%,black_24%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_24%)]"
          aria-hidden="true"
        >
          <HeroGyroscopeGate />
        </div>

        <div
          className={`hero-enter flex flex-col gap-4 max-md:mt-0 max-md:w-full max-md:flex-row max-md:justify-center max-md:items-center md:col-start-1 md:row-start-3 md:mt-12 md:flex-row md:items-center md:gap-6 md:min-w-0 md:max-w-2xl md:translate-x-[10%] lg:max-w-[42rem]`}
          style={delay(220)}
        >
          <ConsultationCta className="max-md:shrink-0" />
        </div>
      </div>

      {/* Inset faint accent line — inner only; section already has max-w-7xl + px-6 lg:px-10 */}
      <SectionDivider embedded />
    </section>
  )
}
