import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useBooking } from '../context/BookingContext'
import { getCalendlyUrl } from '../lib/calendly'
import { CalendlyInline } from './CalendlyInline'

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  },
}

export function BookingModal() {
  const { isOpen, close } = useBooking()
  const url = getCalendlyUrl()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  if (!url) return null

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="booking-shell"
          className="fixed inset-0 z-[100] flex items-center justify-center p-1 sm:p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={close}
            aria-hidden
          />

          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="relative z-10 flex w-max max-w-[min(100vw-8px,1180px)] flex-col overflow-hidden rounded-2xl border border-white/[0.1] sm:rounded-3xl"
            style={{
              maxHeight: 'min(94vh, 900px)',
              background: 'linear-gradient(135deg, rgba(11, 17, 32, 0.97) 0%, rgba(6, 8, 15, 0.99) 100%)',
              boxShadow: `
                0 0 60px -24px rgba(37, 99, 235, 0.18),
                0 24px 64px -16px rgba(0, 0, 0, 0.55),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.06)
              `,
            }}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5 sm:py-3.5">
              <div>
                <h2
                  id="booking-modal-title"
                  className="font-display text-base font-semibold text-qi-fg sm:text-lg"
                >
                  Book Your Consultation
                </h2>
                <p className="mt-0.5 text-[11px] text-qi-muted sm:text-xs">
                  Free — no obligation. Pick a time that works.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] transition hover:border-white/[0.14] hover:bg-white/[0.06]"
                aria-label="Close booking"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-qi-muted transition group-hover:text-qi-fg"
                  />
                </svg>
              </button>
            </div>

            <div className="booking-modal-calendly min-h-0 overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
              <CalendlyInline />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
