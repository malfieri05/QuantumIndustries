import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { ConsultationCta } from './ConsultationCta'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-qi-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex flex-col leading-tight focus-visible:rounded-md">
          <span className="font-display text-base font-semibold tracking-tight text-qi-fg transition group-hover:text-qi-accent-soft sm:text-lg">
            {site.name}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-qi-muted sm:text-[11px]">
            {site.tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium text-qi-muted transition hover:text-qi-fg"
            >
              {item.label}
            </Link>
          ))}
          <ConsultationCta className="!py-2.5 !text-xs" />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ConsultationCta className="!px-4 !py-2 !text-[11px]" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-qi-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-white/[0.08] bg-qi-bg/95 px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-qi-muted hover:bg-white/5 hover:text-qi-fg"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
