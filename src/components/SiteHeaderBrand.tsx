import { site } from '../content/site'

/** Wordmark + subline used in sticky headers (home + booking). */
export function SiteHeaderBrand() {
  return (
    <>
      <span className="flex w-full min-w-0 items-center justify-center gap-[0.535rem] sm:gap-[0.669rem]">
        <span
          className="site-brand-flank site-brand-flank--wordmark-left h-[1.07px] min-h-[1.07px] min-w-[1.338rem] max-w-[2.943rem] flex-1 sm:min-w-[1.605rem] sm:max-w-[3.478rem]"
          aria-hidden
        />
        <span className="shrink-0 whitespace-nowrap font-display text-[1.07rem] font-semibold leading-none tracking-tight text-qi-fg transition group-hover:text-qi-fg sm:text-[1.204rem]">
          {site.brand.wordmark}
        </span>
        <span
          className="site-brand-flank site-brand-flank--wordmark-right h-[1.07px] min-h-[1.07px] min-w-[1.338rem] max-w-[2.943rem] flex-1 sm:min-w-[1.605rem] sm:max-w-[3.478rem]"
          aria-hidden
        />
      </span>
      <span className="mt-0.5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-qi-muted sm:text-[11px]">
        {site.brand.subline}
      </span>
    </>
  )
}
