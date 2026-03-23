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

export function Hero() {
  return (
    <section
      id="home"
      className="relative mx-auto max-w-7xl flow-root px-6 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Two columns at all breakpoints — gyro stays right (same topology as desktop); scale type + gyro height on small screens. */}
      <div className="relative z-10 grid min-h-0 grid-cols-2 items-center gap-x-3 sm:gap-x-4 md:gap-x-8 lg:gap-x-10">
        <div className="min-w-0 max-w-2xl md:translate-x-[10%] lg:max-w-[42rem]">
          <p
            className="hero-enter mb-6 max-md:mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-qi-muted sm:text-xs"
            style={delay(0)}
          >
            {site.hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="hero-enter font-display font-semibold leading-[1.02] tracking-[-0.02em] max-md:text-[clamp(0.95rem,3.8vw,1.65rem)] max-md:leading-[1.08] md:text-[4.05rem] md:leading-[1.02]"
            style={delay(110)}
          >
            {site.hero.headline.split('\n').map((line, i) => (
              <span key={i} className="block">
                {i === 0 ? (
                  <span className="text-qi-fg">{line}</span>
                ) : (
                  <span className="mt-1 block text-qi-fg/92">{line}</span>
                )}
              </span>
            ))}
          </h1>

          <div
            className="hero-enter mt-10 flex flex-col gap-4 max-md:mt-6 sm:flex-row sm:items-center sm:gap-6 sm:mt-12"
            style={delay(220)}
          >
            <ConsultationCta />
          </div>
        </div>

        {/* Gyroscope — right column; shorter on narrow screens so the row fits without stacking. */}
        <div
          className="pointer-events-none relative mx-0 flex h-[min(200px,38svh)] w-full min-h-0 min-w-0 shrink-0 items-stretch justify-self-stretch overflow-x-clip [mask-image:linear-gradient(to_right,transparent_0%,black_26%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_26%)] max-md:h-[min(210px,42svh)] md:h-[min(448px,62.4vh)] md:w-auto md:-translate-x-[10%]"
          aria-hidden="true"
        >
          <HeroGyroscopeGate />
        </div>
      </div>

      {/* Inset faint accent line — inner only; section already has max-w-7xl + px-6 lg:px-10 */}
      <SectionDivider embedded />
    </section>
  )
}
