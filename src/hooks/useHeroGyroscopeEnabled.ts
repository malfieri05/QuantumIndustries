import { useEffect, useState } from 'react'

/**
 * Gate the hero canvas so it does not mount (or run rAF) on small viewports or when
 * the user prefers reduced motion. Display is already `hidden` below `md`, but React
 * still mounted the full scene before — a major main-thread cost on phones.
 */
export function useHeroGyroscopeEnabled(): boolean {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  })

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setEnabled(mq.matches && !rm.matches)
    mq.addEventListener('change', apply)
    rm.addEventListener('change', apply)
    apply()
    return () => {
      mq.removeEventListener('change', apply)
      rm.removeEventListener('change', apply)
    }
  }, [])

  return enabled
}
