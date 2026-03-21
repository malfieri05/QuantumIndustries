import { motion } from 'framer-motion'
import { site } from '../content/site'
import { ConsultationCta } from './ConsultationCta'
import { HeroGyroscope } from './HeroGyroscope'

const ease = [0.25, 0.1, 0.25, 1] as const

export function Hero() {
  return (
    <section
      id="home"
      className="relative mx-auto max-w-7xl px-6 pb-28 pt-20 sm:pb-36 sm:pt-28 lg:px-10 lg:pb-44 lg:pt-32"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10">
        <div className="max-w-2xl lg:max-w-[42rem]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-qi-muted sm:text-xs"
          >
            {site.hero.eyebrow}
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="font-display text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-[4.5rem]"
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
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="mt-8 max-w-xl text-base leading-[1.75] text-qi-muted sm:text-lg sm:leading-[1.8]"
          >
            {site.hero.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <ConsultationCta />
          </motion.div>
        </div>
      </div>

      {/* Gyroscope + particles — hero accent (no opacity delay: lifecycle starts at load) */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 hidden h-[min(560px,78vh)] w-[min(72%,42rem)] -translate-y-1/2 md:block"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
        }}
        aria-hidden="true"
      >
        <HeroGyroscope className="h-full w-full" />
      </div>
    </section>
  )
}
