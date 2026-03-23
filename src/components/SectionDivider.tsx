type SectionDividerProps = {
  /**
   * When true, only the inner block is rendered — use inside a parent that already has
   * `mx-auto max-w-7xl px-6 lg:px-10` (e.g. Hero). Default false wraps with that shell so
   * dividers in `HomePage` match the hero line width.
   */
  embedded?: boolean
}

/**
 * Same visual as the hero bottom rule: vertical rhythm + 2px royal-blue gradient line.
 */
export function SectionDivider({ embedded = false }: SectionDividerProps) {
  const inner = (
    <div className="relative z-10 mx-0 sm:mx-16 lg:mx-24" aria-hidden>
      <div className="h-28 shrink-0 sm:h-32 lg:h-36" />
      <div className="hero-accent-line w-full" />
    </div>
  )

  if (embedded) {
    return inner
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 lg:px-10" aria-hidden>
      {inner}
    </div>
  )
}
