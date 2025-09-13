import { Outlet, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'
import AnimatedCursor from '../ui/AnimatedCursor'
import { useEffect, Suspense, useRef, useState } from 'react';
import io from 'socket.io-client';
import Maintenance from '../../pages/Maintenance';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

const Layout = () => {
  const location = useLocation();
  const socketRef = useRef(null);
  const [publicSettings, setPublicSettings] = useState({ maintenanceMode: false, maintenanceMessage: '', companyName: 'Taliyo' });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

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

  // Load public settings (for maintenance mode)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/settings/public`);
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data) setPublicSettings(data);
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setSettingsLoaded(true);
      }
    };
    load();
    const id = setInterval(load, 60000); // refresh every 60s
    return () => { cancelled = true; clearInterval(id); };
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Taliyo Technologies',
            url: 'https://taliyotechnologies.com',
            logo: 'https://taliyotechnologies.com/favicon.png'
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Taliyo Technologies',
            url: 'https://taliyotechnologies.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://taliyotechnologies.com/blog?q={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SiteNavigationElement',
            name: ['Home','About','Services','Projects','Blog','Contact','FAQ','Testimonials'],
            url: [
              'https://taliyotechnologies.com/',
              'https://taliyotechnologies.com/about',
              'https://taliyotechnologies.com/services',
              'https://taliyotechnologies.com/projects',
              'https://taliyotechnologies.com/blog',
              'https://taliyotechnologies.com/contact',
              'https://taliyotechnologies.com/faq',
              'https://taliyotechnologies.com/testimonials'
            ]
          })}
        </script>
      </Helmet>
      <AnimatedCursor />
      <Header />
      <main className="flex-1 bg-gray-950">
        <Suspense fallback={<div className="min-h-[50vh]" />}> 
          {publicSettings?.maintenanceMode ? (
            <Maintenance message={publicSettings?.maintenanceMessage} companyName={publicSettings?.companyName} />
          ) : (
            <Outlet />
          )}
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Layout