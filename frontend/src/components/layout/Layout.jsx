import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'
import AnimatedCursor from '../ui/AnimatedCursor'
import { useEffect, Suspense, useRef } from 'react';
import io from 'socket.io-client';

const Layout = () => {
  const location = useLocation();
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket once on mount if API URL is provided
    try {
      const apiUrl = import.meta?.env?.VITE_API_URL;
      if (typeof window !== 'undefined' && apiUrl && !socketRef.current) {
        socketRef.current = io(apiUrl, { transports: ['websocket'], autoConnect: true });
      }
    } catch (e) {
      // Silently ignore socket setup errors
      console.error?.('Socket init error:', e);
    }

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        try { socketRef.current.disconnect(); } catch {}
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Emit page view if socket is connected
    try {
      if (!socketRef.current) return;
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = Math.random().toString(36).slice(2);
        localStorage.setItem('userId', userId);
      }
      socketRef.current.emit('pageView', { page: location.pathname, userId });
    } catch {}
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AnimatedCursor />
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-[50vh]" />}> 
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Layout 