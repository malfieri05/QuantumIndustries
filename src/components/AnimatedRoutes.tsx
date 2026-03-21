import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { site } from '../content/site'
import { BookingPage } from '../pages/BookingPage'
import { HomePage } from '../pages/HomePage'

const slideTransition = { duration: 0.42, ease: [0.32, 0.72, 0, 1] as const }

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  const prev = ref.current
  ref.current = value
  return prev
}

/**
 * Full-viewport slide. `AnimatePresence custom` + motion `custom` drive exit/enter.
 * Forward (→ /book): exit left, enter from right. Back (← /): exit right, enter from left.
 */
export function AnimatedRoutes() {
  const location = useLocation()
  const book = site.booking.path
  const pathname = location.pathname
  const prevPathname = usePrevious(pathname)

  const direction = useMemo(() => {
    if (prevPathname === undefined) return 1
    if (prevPathname === '/' && pathname === book) return 1
    if (prevPathname === book && pathname === '/') return -1
    return 1
  }, [prevPathname, pathname, book])

  return (
    <div className="relative min-h-svh overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={{
            initial: (dir: number) => ({
              x: dir === 1 ? '100%' : '-100%',
            }),
            animate: { x: 0 },
            exit: (dir: number) => ({
              x: dir === 1 ? '-100%' : '100%',
            }),
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={slideTransition}
          className="min-h-svh w-full"
          style={{ position: 'absolute', width: '100%', top: 0, left: 0 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path={book} element={<BookingPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
