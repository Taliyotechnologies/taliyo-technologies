import { useState, useEffect } from 'react'

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM3NDE1MSIvPjwvc3ZnPg==',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setHasError(true)
    img.src = src
  }, [src])

  if (hasError) {
    return (
      <div className={`bg-gray-700 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Image not found</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse" />
      )}
      <img
        src={isLoaded ? src : placeholder}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading="lazy"
        {...props}
      />
    </div>
  )
}

export default OptimizedImage 