import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { site } from '../content/site'
import { useHashSectionNavigation } from '../hooks/useHashSectionNavigation'
import { routeSlide } from '../lib/routeTransitions'

const headerPillSizing =
  'min-h-11 px-5 py-2.5 text-xs font-normal tracking-wide transition-colors'

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

const navTooltipClass =
  'pointer-events-none absolute left-1/2 top-full z-[60] mt-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-medium tracking-wide text-qi-fg opacity-0 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.18)] transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100'

function HeaderPhoneButton() {
  return (
    <div className="group relative flex">
      <a
        href={`tel:${site.phone.tel}`}
        className="header-pill inline-flex h-11 min-h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-full p-0 text-qi-fg"
        aria-label={`Call ${site.phone.display}`}
      >
        <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
          />
        </svg>
      </a>
      <span className={navTooltipClass} aria-hidden="true">
        {site.phone.display}
      </span>
    </div>
  )
}

export function Header() {
  const location = useLocation()
  const navigateHashSection = useHashSectionNavigation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`header-enter sticky top-0 z-50 header-bar transition-[box-shadow] duration-300 ${
        scrolled ? 'header-bar--elevated' : ''
      }`}
    >
      <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 px-6 py-4 sm:gap-4 lg:px-10">
        <Link
          to="/"
          state={
            location.pathname === site.booking.path ? routeSlide.back : undefined
          }
          className="group flex min-w-0 max-w-[calc(100%-9.25rem)] shrink flex-col items-center text-center leading-tight focus-visible:rounded-md sm:max-w-none"
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
            {site.nav.map((item) =>
              'iconOnly' in item && item.iconOnly ? (
                <div key={item.href} className="group relative flex">
                  <Link
                    to={item.href}
                    className="header-pill inline-flex h-11 min-h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-full p-0 text-qi-fg"
                    aria-label="Contact — send a message"
                    onClick={(e) => {
                      navigateHashSection(e, item.href)
                    }}
                  >
                    <MailIcon className="h-[18px] w-[18px] shrink-0" />
                  </Link>
                  <span className={navTooltipClass} aria-hidden="true">
                    {item.label}
                  </span>
                </div>
              ) : (
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
              ),
            )}
          </div>
          <div
            className="flex w-6 shrink-0 items-center justify-center self-stretch"
            aria-hidden="true"
          >
            <span className="header-nav-divider" />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={site.booking.path}
              state={routeSlide.forward}
              className={`header-pill ${headerPillSizing}`}
            >
              Book
            </Link>
            <HeaderPhoneButton />
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:hidden">
          <Link
            to={site.booking.path}
            state={routeSlide.forward}
            className={`header-pill ${headerPillSizing}`}
          >
            Book
          </Link>
          <HeaderPhoneButton />
          <button
            type="button"
            className="header-pill inline-flex h-11 min-h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-full p-0"
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
              {site.nav.map((item) =>
                'iconOnly' in item && item.iconOnly ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`header-pill header-pill--block inline-flex min-h-11 items-center justify-center gap-2 ${headerPillSizing}`}
                    onClick={(e) => {
                      navigateHashSection(e, item.href)
                      setOpen(false)
                    }}
                  >
                    <MailIcon className="h-[18px] w-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`header-pill header-pill--block min-h-11 items-center ${headerPillSizing}`}
                    onClick={(e) => {
                      navigateHashSection(e, item.href)
                      setOpen(false)
                    }}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
