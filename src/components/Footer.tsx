import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { useHashSectionNavigation } from '../hooks/useHashSectionNavigation'
import { Reveal } from './Reveal'

export function Footer() {
  const navigateHashSection = useHashSectionNavigation()

  return (
    <footer id="support" className="relative pb-14 pt-24 sm:pb-16 sm:pt-28">
      <div className="section-hairline mx-auto max-w-5xl opacity-70" />

      <div className="mx-auto max-w-7xl px-6 pt-14 sm:px-8 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between sm:gap-16">
            <div>
              <p className="font-display text-lg font-semibold text-qi-fg">{site.name}</p>
              <p className="mt-1 text-sm font-medium tracking-wide text-qi-muted">{site.tagline}</p>
              <p className="mt-5 max-w-sm text-sm leading-[1.75] text-qi-muted">
                {site.footer.blurb}
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 sm:items-end">
              <nav className="flex flex-wrap gap-x-8 gap-y-2" aria-label="Footer">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm text-qi-muted transition-colors duration-200 hover:text-qi-fg"
                    onClick={(e) => {
                      navigateHashSection(e, item.href)
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <p className="text-xs text-qi-muted/70">{site.footer.legal}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
