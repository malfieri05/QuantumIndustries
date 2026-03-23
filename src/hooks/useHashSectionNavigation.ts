import type { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { hashFromHref, scrollToSectionById } from '../lib/hashNav'

/**
 * When already on `/`, same-route hash links (`/#services`) need explicit handling
 * or the SPA won’t scroll. Navigates hash + `HomePage` scrolls via `location.hash`.
 * If the hash is already active, scroll again (repeat tap).
 */
export function useHashSectionNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  return (e: MouseEvent<HTMLAnchorElement>, href: string): boolean => {
    const base = href.split('#')[0] || '/'
    const hash = hashFromHref(href)
    const targetsHome = base === '/' || base === ''

    if (location.pathname !== '/' || !targetsHome || !hash) {
      return false
    }

    e.preventDefault()
    const scrollBehavior: ScrollBehavior = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
      ? 'instant'
      : 'smooth'
    if (location.hash === `#${hash}`) {
      scrollToSectionById(hash, scrollBehavior)
    } else {
      navigate({ pathname: '/', hash: `#${hash}` }, { replace: true })
    }
    return true
  }
}
