import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBooking } from '../context/BookingContext'
import { getCalendlyUrl } from '../lib/calendly'

const panelVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
}

export function BookingModal() {
  const { isOpen, close } = useBooking()
  const containerRef = useRef<HTMLDivElement>(null)
  const [preloaded, setPreloaded] = useState(false)
  const url = getCalendlyUrl()

  const embedUrl = url
    ? `${url}?hide_gdpr_banner=1&background_color=0b1120&text_color=e2e8f0&primary_color=2563eb`
    : null

  // Preload: mount the Calendly widget immediately on page load (hidden)
  // so it's ready instantly when the user clicks "Book"
  useEffect(() => {
    if (!embedUrl || !containerRef.current || preloaded) return

    // Load Calendly CSS
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }

    // Create the inline widget div
    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'calendly-inline-widget'
    widgetDiv.setAttribute('data-url', embedUrl)
    widgetDiv.style.width = '100%'
    widgetDiv.style.height = '100%'
    widgetDiv.style.minWidth = '320px'
    containerRef.current.appendChild(widgetDiv)

    // Load Calendly JS
    if (!document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = () => setPreloaded(true)
      document.head.appendChild(script)
    } else {
      queueMicrotask(() => setPreloaded(true))
    }
  }, [embedUrl, preloaded])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  if (!url) return null

  return (
    <>
      {/*
        Hidden preload container — always mounted, loads the Calendly iframe
        in the background so it's instant when the modal opens.
        We move it into the visible modal when open.
      */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1000px',
          height: '700px',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
        aria-hidden
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={close}
              aria-hidden
            />

            {/* Floating glass panel — wide for side-by-side layout */}
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 flex w-full flex-col overflow-hidden rounded-3xl"
              style={{
                maxWidth: '1080px',
                height: 'min(88vh, 780px)',
                background: 'linear-gradient(135deg, rgba(11, 17, 32, 0.95) 0%, rgba(6, 8, 15, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: `
                  0 0 80px -20px rgba(37, 99, 235, 0.2),
                  0 32px 80px -20px rgba(0, 0, 0, 0.6),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
                  inset 0 -1px 0 0 rgba(255, 255, 255, 0.02)
                `,
              }}
            >
              {/* Glass refraction highlight */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.01) 55%, transparent 60%)',
                }}
                aria-hidden
              />

              {/* Ambient glow */}
              <div className="pointer-events-none absolute -inset-20 -z-10 rounded-full bg-qi-accent/5 blur-[80px]" aria-hidden />

              {/* Header bar */}
              <div className="relative flex items-center justify-between border-b border-white/[0.06] px-6 py-4 sm:px-8">
                <div>
                  <h2 className="font-display text-lg font-semibold text-qi-fg">
                    Book Your Consultation
                  </h2>
                  <p className="mt-0.5 text-xs text-qi-muted">
                    Free — no obligation. Pick a time that works.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]"
                  aria-label="Close booking"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-qi-muted group-hover:text-qi-fg transition-colors" />
                  </svg>
                </button>
              </div>

              {/* Calendly embed — uses a portal-like approach to move the preloaded widget here */}
              <CalendlyEmbed embedUrl={embedUrl!} preloadRef={containerRef} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * Moves the preloaded Calendly container into the visible modal when mounted,
 * and moves it back to the hidden container when unmounted.
 */
function CalendlyEmbed({
  embedUrl,
  preloadRef,
}: {
  embedUrl: string
  preloadRef: React.RefObject<HTMLDivElement | null>
}) {
  const slotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slot = slotRef.current
    const preload = preloadRef.current
    if (!slot || !preload) return

    // Move the preloaded widget into the visible slot
    const widget = preload.querySelector('.calendly-inline-widget')
    if (widget) {
      slot.appendChild(widget)
      // Make visible
      preload.style.visibility = 'visible'
    } else {
      // Fallback: create fresh embed
      const widgetDiv = document.createElement('div')
      widgetDiv.className = 'calendly-inline-widget'
      widgetDiv.setAttribute('data-url', embedUrl)
      widgetDiv.style.width = '100%'
      widgetDiv.style.height = '100%'
      widgetDiv.style.minWidth = '320px'
      slot.appendChild(widgetDiv)

      // @ts-expect-error Calendly global
      if (window.Calendly) {
        // @ts-expect-error Calendly global
        window.Calendly.initInlineWidget({
          url: embedUrl,
          parentElement: widgetDiv,
        })
      }
    }

    return () => {
      // Move widget back to hidden preload container
      if (widget && preload) {
        preload.appendChild(widget)
      }
    }
  }, [embedUrl, preloadRef])

  return <div ref={slotRef} className="relative flex-1 overflow-hidden" />
}
