import { useCallback, useRef } from 'react'

// Debounce hook for performance optimization
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null)

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])

  return debouncedCallback
}

// Throttle hook for performance optimization
export const useThrottle = (callback, delay) => {
  const lastCall = useRef(0)
  const lastCallTimer = useRef(null)

  const throttledCallback = useCallback((...args) => {
    const now = Date.now()
    
    if (now - lastCall.current >= delay) {
      callback(...args)
      lastCall.current = now
    } else {
      if (lastCallTimer.current) {
        clearTimeout(lastCallTimer.current)
      }
      lastCallTimer.current = setTimeout(() => {
        callback(...args)
        lastCall.current = Date.now()
      }, delay - (now - lastCall.current))
    }
  }, [callback, delay])

  return throttledCallback
}

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (callback, options = {}) => {
  const observerRef = useRef(null)
  const elementRef = useRef(null)

  const setElement = useCallback((element) => {
    if (elementRef.current) {
      observerRef.current?.disconnect()
    }
    
    elementRef.current = element
    
    if (element) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry)
          }
        })
      }, options)
      
      observerRef.current.observe(element)
    }
  }, [callback, options])

  return setElement
}

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const startTime = useRef(0)
  
  const startTimer = useCallback(() => {
    startTime.current = performance.now()
  }, [])
  
  const endTimer = useCallback((label = 'Operation') => {
    const endTime = performance.now()
    const duration = endTime - startTime.current
    
    if (import.meta.env.DEV) {
      console.log(`${label} took ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }, [])
  
  return { startTimer, endTimer }
} 