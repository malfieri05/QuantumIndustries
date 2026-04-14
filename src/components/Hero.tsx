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

/** Shared with eyebrow / h1 / CTA on desktop (translate); mobile uses centered stack. */
const heroTextCol =
  'min-w-0 max-w-2xl md:translate-x-[10%] lg:max-w-[42rem]'

export function Hero() {
  const headlineLines = site.hero.headline.split('\n').filter(Boolean)
  /** NBSP so each mobile row stays one line. Row 1 = first two headline lines; row 2 = the rest (last line may be multi-word). */
  const nbsp = '\u00a0'
  const mobileLine1 =
    headlineLines.length >= 2 ? `${headlineLines[0]}${nbsp}${headlineLines[1]}` : (headlineLines[0] ?? '')
  const tail = headlineLines.length > 2 ? headlineLines.slice(2) : []
  const lastHeadlineSegment = tail.pop() ?? ''
  const mobileLine2 = [...tail, ...lastHeadlineSegment.trim().split(/\s+/)]
    .filter(Boolean)
    .join(nbsp)

  return (
    <section
      id="home"
      className="relative mx-auto max-w-7xl flow-root px-6 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20"
      aria-labelledby="hero-heading"
    >
      {/*
        Mobile: flex column — eyebrow, headline, subhead, gyro, CTA.
        md+: col1 = eyebrow, h1, subhead, CTA; col2 row-span-4 = gyro.
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
          aria-describedby="hero-subhead"
        >
          <span className="md:hidden">
            <span className="block text-qi-fg">{mobileLine1}</span>
            <span className="mt-1 block text-qi-fg/92">{mobileLine2}</span>
          </span>
          <span className="hidden md:block">
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {i === 0 ? (
                  <span className="text-qi-fg">{line}</span>
                ) : (
                  <span className="mt-1 block text-qi-fg/92">{line}</span>
                )}
              </span>
            ))}
          </span>
        </h1>

        <p
          id="hero-subhead"
          className={`hero-enter mt-4 max-w-xl text-base font-medium leading-snug text-qi-muted max-md:text-center sm:text-lg md:col-start-1 md:row-start-3 md:mt-5 md:text-xl md:leading-relaxed ${heroTextCol}`}
          style={delay(170)}
        >
          {site.hero.subhead}
        </p>

        {/* Gyroscope — mobile: between subhead and CTA; md+: right column spanning all text rows. */}
        <div
          className="pointer-events-none relative mx-0 block w-full min-w-0 min-h-[252px] max-md:min-h-[270px] max-md:h-[min(306px,45svh)] max-md:overflow-x-clip justify-self-stretch md:col-start-2 md:row-span-4 md:row-start-1 md:min-h-0 md:h-[min(403px,56.16vh)] md:w-auto md:self-center md:-translate-x-[10%] md:[mask-image:linear-gradient(to_right,transparent_0%,black_24%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_24%)]"
          aria-hidden="true"
        >
          <HeroGyroscopeGate />
        </div>

        <div
          className={`hero-enter flex flex-col gap-4 max-md:mt-0 max-md:w-full max-md:flex-row max-md:justify-center max-md:items-center md:col-start-1 md:row-start-4 md:mt-8 md:flex-row md:items-center md:gap-6 md:min-w-0 md:max-w-2xl md:translate-x-[10%] lg:max-w-[42rem]`}
          style={delay(230)}
        >
          <ConsultationCta className="max-md:shrink-0" />
        </div>
      </div>

      {/* Inset faint accent line — inner only; section already has max-w-7xl + px-6 lg:px-10 */}
      <SectionDivider embedded />
    </section>
  )
}
