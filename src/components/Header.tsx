import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { site } from '../content/site'
import { useHashSectionNavigation } from '../hooks/useHashSectionNavigation'
import { routeSlide } from '../lib/routeTransitions'

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
      className={`sticky top-0 z-50 transition-[background,backdrop-filter,border-color,box-shadow] duration-300 ${
        scrolled ? 'glass-header' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link
          to="/"
          state={
            location.pathname === site.booking.path ? routeSlide.back : undefined
          }
          className="group flex flex-col leading-tight focus-visible:rounded-md"
        >
          <span className="font-display text-base font-semibold tracking-tight text-qi-fg transition group-hover:text-qi-fg sm:text-lg">
            {site.name}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-qi-muted sm:text-[11px]">
            {site.tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="relative text-sm font-medium text-qi-muted transition-colors duration-300 hover:text-qi-fg after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-qi-accent after:transition-all after:duration-300 hover:after:w-full"
              onClick={(e) => {
                navigateHashSection(e, item.href)
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={site.booking.path}
            state={routeSlide.forward}
            className="btn-secondary !rounded-lg !px-4 !py-2 !text-xs font-semibold"
          >
            Book
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to={site.booking.path}
            state={routeSlide.forward}
            className="btn-secondary !rounded-lg !px-3 !py-2 !text-xs font-semibold"
          >
            Book
          </Link>
          <button
            type="button"
            className="glass inline-flex h-10 w-10 items-center justify-center rounded-xl text-qi-fg transition-colors hover:text-qi-fg"
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
            className="glass-header overflow-hidden border-t border-white/[0.06] md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-qi-muted transition hover:bg-white/[0.04] hover:text-qi-fg"
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
