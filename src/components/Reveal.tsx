import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

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
  return (
    <motion.div
      className={className}
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
