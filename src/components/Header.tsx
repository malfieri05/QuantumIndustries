import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { site } from '../content/site'
import { useHashSectionNavigation } from '../hooks/useHashSectionNavigation'
import { routeSlide } from '../lib/routeTransitions'

const headerPillSizing =
  'min-h-10 px-5 py-2.5 text-xs font-normal tracking-wide transition-colors'

export function Header() {
  const location = useLocation()
  const navigateHashSection = useHashSectionNavigation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`sticky top-0 z-50 header-bar transition-[box-shadow] duration-300 ${
        scrolled ? 'header-bar--elevated' : ''
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link
          to="/"
          state={
            location.pathname === site.booking.path ? routeSlide.back : undefined
          }
          className="group flex flex-col items-center text-center leading-tight focus-visible:rounded-md"
        >
          <span className="font-display text-base font-semibold tracking-tight text-qi-fg transition group-hover:text-qi-fg sm:text-lg">
            {site.name}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-qi-muted sm:text-[11px]">
            {site.tagline}
          </span>
        </Link>

        <nav className="hidden items-center md:flex" aria-label="Primary">
          <div className="flex items-center gap-2">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`header-pill ${headerPillSizing}`}
                onClick={(e) => {
                  navigateHashSection(e, item.href)
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div
            className="flex w-6 shrink-0 items-center justify-center self-stretch"
            aria-hidden="true"
          >
            <span className="header-nav-divider" />
          </div>
          <Link
            to={site.booking.path}
            state={routeSlide.forward}
            className={`header-pill ${headerPillSizing}`}
          >
            Book
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to={site.booking.path}
            state={routeSlide.forward}
            className={`header-pill ${headerPillSizing}`}
          >
            Book
          </Link>
          <button
            type="button"
            className="header-pill inline-flex h-10 min-h-10 w-10 min-w-10 shrink-0 items-center justify-center rounded-full p-0"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="header-bar overflow-hidden border-t border-black/[0.06] md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`header-pill header-pill--block ${headerPillSizing}`}
                  onClick={(e) => {
                    navigateHashSection(e, item.href)
                    setOpen(false)
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
