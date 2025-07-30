import { useState, useEffect } from 'react'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      setIsVisible(true)
      
      // Measure page load performance
      const measurePerformance = () => {
        const navigation = performance.getEntriesByType('navigation')[0]
        if (navigation) {
          setMetrics(prev => ({
            ...prev,
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
          }))
        }

        // Measure paint timing
        const paintEntries = performance.getEntriesByType('paint')
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({
              ...prev,
              firstContentfulPaint: entry.startTime
            }))
          }
        })

        // Measure LCP
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
        if (lcpEntries.length > 0) {
          const lcp = lcpEntries[lcpEntries.length - 1]
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: lcp.startTime
          }))
        }
      }

      // Wait for page to fully load
      if (document.readyState === 'complete') {
        measurePerformance()
      } else {
        window.addEventListener('load', measurePerformance)
      }

      return () => {
        window.removeEventListener('load', measurePerformance)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="performance-monitor show">
      <div className="text-xs">
        <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
        <div>DOM: {metrics.domContentLoaded.toFixed(0)}ms</div>
        <div>FCP: {metrics.firstContentfulPaint.toFixed(0)}ms</div>
        <div>LCP: {metrics.largestContentfulPaint.toFixed(0)}ms</div>
      </div>
    </div>
  )
}

export default PerformanceMonitor 