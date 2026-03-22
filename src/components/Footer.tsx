import { site } from '../content/site'
import { Reveal } from './Reveal'

export function Footer() {
  return (
    <footer
      id="support"
      className="relative bg-[var(--color-qi-header-bg)] pb-14 pt-4 sm:pb-16 sm:pt-5"
    >
      <div className="section-hairline mx-auto max-w-5xl opacity-70" />

      <div className="mx-auto max-w-7xl px-6 pt-8 sm:px-8 sm:pt-10 lg:px-10">
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
              <p className="text-xs text-qi-muted/70">{site.footer.legal}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
