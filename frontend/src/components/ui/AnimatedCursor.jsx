import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AnimatedCursor = () => {
  // Add state to detect mobile/tablet
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  // Remove the logic that disables the cursor for /admin pages
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Detect mobile or tablet (touch device or small screen)
    const checkTouch = () => {
      const isTouch = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024 // You can adjust this breakpoint as needed
      );
      setIsTouchDevice(isTouch);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
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