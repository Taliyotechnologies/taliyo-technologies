import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

// Convert a base64 public VAPID key to a Uint8Array
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [endpoint, setEndpoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const swRegRef = useRef(null);

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);
    if (supported) setPermission(Notification.permission);
  }, []);

  const registerSW = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null;
    if (swRegRef.current) return swRegRef.current;
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready; // ensure active
    swRegRef.current = reg;
    return reg;
  }, []);

  const getPublicKey = useCallback(async () => {
    const res = await fetch(`${API}/api/push/public-key`);
    if (!res.ok) throw new Error('Failed to fetch VAPID public key');
    const data = await res.json();
    if (!data.publicKey) throw new Error('No public key provided by server');
    return data.publicKey;
  }, []);

  const saveSubscription = useCallback(async (sub) => {
    await fetch(`${API}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub)
    });
  }, []);

  const removeSubscription = useCallback(async (endpoint) => {
    await fetch(`${API}/api/push/subscribe`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint })
    });
  }, []);

  const checkExisting = useCallback(async () => {
    try {
      setError('');
      const reg = await registerSW();
      if (!reg) return;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        setIsSubscribed(true);
        setEndpoint(sub.endpoint || '');
      } else {
        setIsSubscribed(false);
        setEndpoint('');
      }
      setPermission(Notification.permission);
    } catch (e) {
      setError(e?.message || 'Failed to check subscription');
    }
  }, [registerSW]);

  useEffect(() => { if (isSupported) checkExisting(); }, [isSupported, checkExisting]);

  const enablePush = useCallback(async () => {
    if (!isSupported) return false;
    setLoading(true); setError('');
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') throw new Error('Permission not granted');
      const reg = await registerSW();
      const publicKey = await getPublicKey();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
      await saveSubscription(sub.toJSON());
      setIsSubscribed(true);
      setEndpoint(sub.endpoint || '');
      return true;
    } catch (e) {
      setError(e?.message || 'Failed to enable push');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getPublicKey, registerSW, saveSubscription, isSupported]);

  const disablePush = useCallback(async () => {
    if (!isSupported) return;
    setLoading(true); setError('');
    try {
      const reg = await registerSW();
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const ep = sub.endpoint;
        await sub.unsubscribe();
        setIsSubscribed(false);
        setEndpoint('');
        if (ep) await removeSubscription(ep);
      }
    } catch (e) {
      setError(e?.message || 'Failed to disable push');
    } finally {
      setLoading(false);
    }
  }, [registerSW, removeSubscription, isSupported]);

  const sendTest = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/admin/push/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({})
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to send test notification');
      return data;
    } catch (e) {
      setError(e?.message || 'Failed to send test notification');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    endpoint,
    loading,
    error,
    enablePush,
    disablePush,
    sendTest,
  };
}
