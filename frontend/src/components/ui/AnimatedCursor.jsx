import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AnimatedCursor = () => {
  // Add state to detect mobile/tablet
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // More reliable mobile/tablet detection
    const checkDevice = () => {
      // Check for touch support
      const hasTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      navigator.msMaxTouchPoints > 0;
      
      // Check screen width (1024px is common breakpoint for tablets in landscape)
      const isSmallScreen = window.innerWidth < 1024;
      
      // User agent detection as fallback
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
      
      // If any condition is true, consider it a mobile/tablet device
      const isTouchDevice = hasTouch && (isSmallScreen || isMobile);
      
      setIsTouchDevice(isTouchDevice);
      
      // Restore default cursor on touch devices
      if (isTouchDevice) {
        document.body.style.cursor = '';
        const mainRoot = document.getElementById('root');
        if (mainRoot) mainRoot.style.cursor = '';
      } else {
        document.body.style.cursor = 'none';
        const mainRoot = document.getElementById('root');
        if (mainRoot) mainRoot.style.cursor = 'none';
      }
    };
    
    // Run check on mount and window resize
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    // Also check on orientation change for tablets
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  // Skip cursor setup if on touch device
  useEffect(() => {
    if (isTouchDevice) return;
    
    document.body.style.cursor = 'none';
    const mainRoot = document.getElementById('root');
    if (mainRoot) mainRoot.style.cursor = 'none';

    const dot = dotRef.current;
    const ring = ringRef.current;

    const moveCursor = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      ring.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    document.addEventListener('mousemove', moveCursor);

    // Scale on click
    const handleClick = () => {
      dot.classList.add('cursor-future-dot-click');
      ring.classList.add('cursor-future-ring-click');
      setTimeout(() => {
        dot.classList.remove('cursor-future-dot-click');
        ring.classList.remove('cursor-future-ring-click');
      }, 180);
    };
    document.addEventListener('mousedown', handleClick);

    // Scale on hover over clickable elements
    const addHoverEvents = () => {
      document.querySelectorAll('a, button, [role="button"], .cursor-pointer').forEach(el => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('cursor-future-dot-hover');
          ring.classList.add('cursor-future-ring-hover');
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('cursor-future-dot-hover');
          ring.classList.remove('cursor-future-ring-hover');
        });
      });
    };
    addHoverEvents();

    return () => {
      document.body.style.cursor = '';
      if (mainRoot) mainRoot.style.cursor = '';
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-future-ring pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ pointerEvents: 'none' }}
      ></div>
      <div
        ref={dotRef}
        className="cursor-future-dot pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ pointerEvents: 'none' }}
      ></div>
    </>
  );
};

export default AnimatedCursor;