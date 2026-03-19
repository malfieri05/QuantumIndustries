import { site } from '../content/site'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-qi-surface/50 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-qi-fg">{site.name}</p>
          <p className="mt-1 text-sm font-medium text-qi-accent-soft">{site.tagline}</p>
          <p className="mt-3 max-w-md text-sm text-qi-muted">{site.footer.blurb}</p>
        </div>
        <p className="text-xs text-qi-muted/80">{site.footer.legal}</p>
      </div>
    </footer>
  )
}
