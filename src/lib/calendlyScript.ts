/** Load Calendly widget.js once; resolves when `window.Calendly` is ready. */
export function loadCalendlyScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()

  if (window.Calendly) return Promise.resolve()

  const existing = document.querySelector<HTMLScriptElement>('script[data-calendly-widget]')
  if (existing) {
    return new Promise((resolve) => {
      const done = () => {
        if (window.Calendly) resolve()
        else requestAnimationFrame(done)
      }
      done()
    })
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://assets.calendly.com/assets/external/widget.js'
    s.async = true
    s.dataset.calendlyWidget = 'true'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Calendly widget script'))
    document.body.appendChild(s)
  })
}
