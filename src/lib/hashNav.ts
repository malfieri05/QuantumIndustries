/** Hash segment from `/#services` or `#services`. */
export function hashFromHref(href: string): string | null {
  const i = href.indexOf('#')
  if (i === -1) return null
  return href.slice(i + 1) || null
}

export function scrollToSectionById(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
