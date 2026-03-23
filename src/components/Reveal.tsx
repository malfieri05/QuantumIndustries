import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { Children, isValidElement, useRef, type ReactNode } from 'react'
import { useMdUp } from '../hooks/useMdUp'

const ease = [0.25, 0.1, 0.25, 1] as const

/** useInView options — px margin avoids % quirks; ~20% visible area */
const revealInViewOpts = {
  amount: 0.2,
  margin: '0px 0px -10% 0px',
} as const

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
}

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
}

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
}

const variantMap = {
  default: defaultVariants,
  fade: fadeVariants,
  'slide-left': slideLeftVariants,
  'slide-right': slideRightVariants,
  scale: scaleVariants,
} as const

type RevealProps = {
  children: ReactNode
  className?: string
  variant?: keyof typeof variantMap
  delay?: number
  duration?: number
  once?: boolean
}

export function Reveal({
  children,
  className,
  variant = 'default',
  delay = 0,
  duration = 0.7,
  once = true,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const mdUp = useMdUp()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once,
    amount: revealInViewOpts.amount,
    margin: revealInViewOpts.margin,
  })

  if (prefersReducedMotion || !mdUp) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      layout={false}
      className={className}
      variants={variantMap[variant]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{
        duration,
        delay,
        ease,
      }}
    >
      {children}
    </motion.div>
  )
}

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
}

type RevealStaggerProps = {
  children: ReactNode
  className?: string
}

/**
 * Scroll-triggered stagger for sibling blocks (e.g. grid cards). Each direct child
 * must be a single element; keys should live on those children.
 */
export function RevealStagger({ children, className }: RevealStaggerProps) {
  const prefersReducedMotion = useReducedMotion()
  const mdUp = useMdUp()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: true,
    amount: revealInViewOpts.amount,
    margin: revealInViewOpts.margin,
  })

  if (prefersReducedMotion || !mdUp) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      layout={false}
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          return child
        }
        const key = child.key != null ? child.key : `reveal-stagger-${index}`
        return (
          <motion.div
            key={key}
            layout={false}
            variants={staggerItemVariants}
            className="h-full"
          >
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
