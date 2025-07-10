import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AnimatedCursor = () => {
  // Remove the logic that disables the cursor for /admin pages
  const dotRef = useRef(null);
  const ringRef = useRef(null);

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