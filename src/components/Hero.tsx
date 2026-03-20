import { motion } from 'framer-motion'
import { site } from '../content/site'
import { ConsultationCta } from './ConsultationCta'

const ease = [0.25, 0.1, 0.25, 1] as const

export function Hero() {
  return (
    <section
      className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pt-24 lg:px-10 lg:pb-32"
      aria-labelledby="hero-heading"
    >
      {/* Top accent line */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(100%,56rem)] -translate-x-1/2 section-glow-line" />

      <div className="grid items-center gap-12 lg:grid-cols-[1fr,auto] lg:gap-20">
        {/* Left: copy */}
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-qi-accent-soft sm:text-sm"
          >
            {site.hero.eyebrow}
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {site.hero.headline.split('\n').map((line, i) => (
              <span key={i} className="block">
                {i === 0 ? (
                  <span className="text-qi-fg">{line}</span>
                ) : (
                  <span className="bg-gradient-to-r from-qi-accent-bright via-qi-accent-soft to-qi-violet-soft bg-clip-text text-transparent">
                    {line}
                  </span>
                )}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="mt-6 max-w-xl text-base leading-relaxed text-qi-muted sm:text-lg"
          >
            {site.hero.subhead}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-4 max-w-lg text-sm leading-relaxed text-qi-muted/80 sm:text-base"
          >
            {site.hero.supporting}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
          >
            <ConsultationCta />
            <a href="#services" className="btn-secondary">
              Explore services
            </a>
          </motion.div>
        </div>

        {/* Right: 3D Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          className="hero-orb-wrapper hidden justify-center lg:flex"
          aria-hidden="true"
        >
          <div className="hero-orb">
            <div className="hero-orb-ring" />
            <div className="hero-orb-ring-inner" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
