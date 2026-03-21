/** Default public Cal.com event (override with `VITE_CAL_BOOKING_URL` in `.env`). */
export const DEFAULT_CAL_BOOKING_URL =
  'https://cal.com/quantumindustries/30min'

/** Public Cal.com scheduling URL — env override or default above. */
export function getCalBookingUrl(): string {
  const raw = import.meta.env.VITE_CAL_BOOKING_URL
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t.startsWith('http')) return t
  }
  return DEFAULT_CAL_BOOKING_URL
}

/** Path segment for embed API, e.g. `quantumindustries/30min` (no leading slash). */
export function getCalLinkPath(): string {
  try {
    const u = new URL(getCalBookingUrl())
    const path = u.pathname.replace(/^\//, '').replace(/\/$/, '')
    return path || 'quantumindustries/30min'
  } catch {
    return 'quantumindustries/30min'
  }
}
