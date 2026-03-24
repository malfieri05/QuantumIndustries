import { site } from '../content/site'
import { useMdUp } from '../hooks/useMdUp'

export function Footer() {
  const mdUp = useMdUp()

  return (
    <footer className="relative bg-[var(--color-qi-header-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-12 lg:gap-16">
          <div className="max-w-sm sm:max-w-[min(100%,28rem)]">
            <p className="text-sm leading-[1.75] text-qi-muted">{site.footer.blurb}</p>
            <p className="mt-1 text-xs text-qi-muted/70">
              {site.footer.legal}
              <span className="font-normal text-transparent selection:bg-qi-accent/25 selection:text-qi-fg">
                {' '}
                Jaron Armiger
              </span>
            </p>
          </div>

          <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-end">
            <img
              src="/LOGO-NOBACKGROUND.png"
              alt={site.name}
              className="h-auto w-auto max-h-36 max-w-[min(100%,320px)] object-contain object-right sm:max-h-40 sm:max-w-[min(100%,min(42vw,380px))] lg:max-h-44 lg:max-w-[min(100%,420px)]"
              decoding="async"
              loading={mdUp ? 'lazy' : 'eager'}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
