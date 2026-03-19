/** Public Calendly URL from `.env`; may be empty during local setup. */
export function getCalendlyUrl(): string | undefined {
  const raw = import.meta.env.VITE_CALENDLY_URL
  if (typeof raw !== 'string') return undefined
  const trimmed = raw.trim()
  if (!trimmed || !trimmed.startsWith('http')) return undefined
  return trimmed
}

export function hasCalendlyConfigured(): boolean {
  return getCalendlyUrl() != null
}
