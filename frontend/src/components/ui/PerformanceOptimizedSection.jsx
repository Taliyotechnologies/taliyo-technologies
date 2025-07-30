import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

const PerformanceOptimizedSection = ({ 
  children, 
  className = '', 
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  ...props 
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { threshold, once: true })
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isInView) {
      setShouldAnimate(true)
    }
  }, [isInView])

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Animation variants
  const variants = {
    fadeIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    slideInRight: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 }
    }
  }

  // If user prefers reduced motion or on mobile, render without animations
  if (prefersReducedMotion || isMobile) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants[animation]}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default PerformanceOptimizedSection 