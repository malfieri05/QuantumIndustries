import { useEffect, useState } from 'react'

/** Tailwind `md` (768px) — matches desktop layout where scroll reveals run. */
const query = '(min-width: 768px)'

function getMatches(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}

/**
 * True when viewport is `md` and up. Used to keep scroll / entrance motion desktop-only.
 */
export function useMdUp(): boolean {
  const [mdUp, setMdUp] = useState(getMatches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const apply = () => setMdUp(mq.matches)
    mq.addEventListener('change', apply)
    apply()
    return () => mq.removeEventListener('change', apply)
  }, [])

  return mdUp
}
