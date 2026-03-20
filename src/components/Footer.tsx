import { site } from '../content/site'
import { Reveal } from './Reveal'

export function Footer() {
  return (
    <footer className="relative pt-20 pb-12">
      <div className="section-glow-line mx-auto max-w-5xl" />

      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-lg font-semibold text-qi-fg">{site.name}</p>
              <p className="mt-1 text-sm font-medium text-qi-accent-soft">{site.tagline}</p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-qi-muted">
                {site.footer.blurb}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <nav className="flex gap-6" aria-label="Footer">
                {site.nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-qi-muted transition-colors duration-300 hover:text-qi-fg"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <p className="text-xs text-qi-muted/60">{site.footer.legal}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
