import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'
import AnimatedCursor from '../ui/AnimatedCursor'
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Layout = () => {
  const location = useLocation();
  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = Math.random().toString(36).slice(2);
      localStorage.setItem('userId', userId);
    }
    socket.emit('pageView', { page: location.pathname, userId });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AnimatedCursor />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Layout 