import { useEffect, useState } from 'react'

function computeEnabled(): boolean {
  if (typeof window === 'undefined') return false
  const narrow = window.matchMedia('(max-width: 767px)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  /** Narrow: always show decorative gyro. Desktop: respect reduced motion. */
  return narrow || !reduced
}

/**
 * Gate the hero canvas: always mount on narrow viewports (Tailwind `md` breakpoint);
 * on `md` and up, only when the user does not prefer reduced motion.
 */
export function useHeroGyroscopeEnabled(): boolean {
  const [enabled, setEnabled] = useState(computeEnabled)

  useEffect(() => {
    const narrowMq = window.matchMedia('(max-width: 767px)')
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      setEnabled(narrowMq.matches || !reducedMq.matches)
    }
    narrowMq.addEventListener('change', apply)
    reducedMq.addEventListener('change', apply)
    apply()
    return () => {
      narrowMq.removeEventListener('change', apply)
      reducedMq.removeEventListener('change', apply)
    }
  }, [])

  return enabled
}
