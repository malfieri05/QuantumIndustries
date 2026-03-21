import { AnimatePresence, motion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { site } from '../content/site'
import { BookingPage } from '../pages/BookingPage'
import { HomePage } from '../pages/HomePage'

/**
 * Expo-out: launches fast, settles gently — matches iOS panel-swipe muscle
 * memory. The old [0.32, 0.72, 0, 1] curve stalled near the end, causing the
 * "thud" feeling as pages landed.
 */
const SLIDE = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }

/**
 * Hoisted to module level — object identity is stable across renders so
 * Framer Motion never re-diffs the variant map during an active animation.
 */
const variants = {
  initial: (dir: 1 | -1) => ({ x: dir === 1 ? '100%' : '-100%' }),
  animate: { x: 0 },
  exit:    (dir: 1 | -1) => ({ x: dir === 1 ? '-100%' : '100%' }),
}

type SlideState = { slide?: 1 | -1 }

/**
 * Full-viewport panel slide. `mode="sync"` means exit and enter run in
 * parallel — both pages are in the DOM simultaneously and slide as one unit,
 * exactly like a native iOS sheet. The previous `mode="wait"` serialised the
 * animations (exit finishes → enter starts), doubling the perceived duration
 * and leaving the screen half-empty mid-transition.
 */
export function AnimatedRoutes() {
  const location = useLocation()
  const { pathname } = location
  const book = site.booking.path
  const prevPathRef = useRef(pathname)

  // Prefer the explicit intent attached to the Link's state; fall back to
  // path order so un-annotated navigations (e.g. browser back) still
  // slide in the correct direction.
  const slideFromState = (location.state as SlideState | null)?.slide
  const directionRef = useRef<1 | -1>(1)

  if (slideFromState === 1 || slideFromState === -1) {
    directionRef.current = slideFromState
  } else {
    const order = (p: string) => (p === book ? 1 : 0)
    directionRef.current = order(pathname) >= order(prevPathRef.current) ? 1 : -1
  }

  useLayoutEffect(() => {
    prevPathRef.current = pathname
  }, [pathname])

  return (
    <div className="relative min-h-svh overflow-x-hidden">
      <AnimatePresence mode="sync" initial={false} custom={directionRef.current}>
        <motion.div
          key={pathname}
          custom={directionRef.current}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={SLIDE}
          className="absolute inset-x-0 top-0 min-h-svh w-full"
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
