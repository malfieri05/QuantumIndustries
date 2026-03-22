import type { CSSProperties } from 'react'
import { site } from '../content/site'
import { ConsultationCta } from './ConsultationCta'
import { HeroGyroscope } from './HeroGyroscope'

const delay = (ms: number): CSSProperties =>
  ({ '--hero-enter-delay': `${ms}ms` }) as CSSProperties

export function Hero() {
  return (
    <section
      id="home"
      className="relative mx-auto max-w-7xl flow-root px-6 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Text + gyro share one grid so alignment is not tied to full section height (divider below). */}
      <div className="relative z-10 md:grid md:min-h-0 md:grid-cols-2 md:items-center md:gap-x-8 lg:gap-x-10">
        <div className="min-w-0 max-w-2xl md:translate-x-[10%] lg:max-w-[42rem]">
          <p
            className="hero-enter mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-qi-muted sm:text-xs"
            style={delay(0)}
          >
            {site.hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="hero-enter font-display text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-[4.5rem]"
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
            className="hero-enter mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 sm:mt-12"
            style={delay(220)}
          >
            <ConsultationCta />
          </div>
        </div>

        {/* Gyroscope — right column, vertically centered with text block (not whole section). */}
        <div
          className="pointer-events-none relative -mx-6 hidden h-[min(416px,57.6vh)] w-auto min-h-0 justify-self-stretch md:mx-0 md:block md:h-[min(448px,62.4vh)] md:-translate-x-[10%]"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 24%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 24%)',
          }}
          aria-hidden="true"
        >
          <HeroGyroscope className="h-full w-full" />
        </div>
      </div>

      {/* Inset faint accent line — spacer uses explicit height so offset is not lost to margin collapse */}
      <div className="relative z-10 mx-10 sm:mx-16 lg:mx-24">
        <div
          className="h-28 shrink-0 sm:h-32 lg:h-36"
          aria-hidden
        />
        <div className="hero-accent-line w-full" aria-hidden />
      </div>
    </section>
  )
}
