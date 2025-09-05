import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

const getOrCreateClientId = () => {
  let cid = localStorage.getItem('clientId');
  if (!cid) {
    cid = 'cid_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('clientId', cid);
  }
  return cid;
};

const readUtm = (search) => {
  const p = new URLSearchParams(search || window.location.search);
  return {
    utmSource: p.get('utm_source') || undefined,
    utmMedium: p.get('utm_medium') || undefined,
    utmCampaign: p.get('utm_campaign') || undefined,
    utmTerm: p.get('utm_term') || undefined,
    utmContent: p.get('utm_content') || undefined,
  };
};

export default function useAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    const payload = {
      path: location.pathname + location.search,
      clientId: getOrCreateClientId(),
      referrer: document.referrer || '',
      ...readUtm(location.search),
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
    };

    // Fire and forget
    fetch(`${API}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {});

    return () => controller.abort();
  }, [location.pathname, location.search]);
}
