/* Basic service worker for push notifications */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    try { payload = { title: 'Notification', body: event.data && event.data.text ? event.data.text() : '' }; } catch {}
  }

  const title = payload.title || 'Taliyo';
  const options = {
    body: payload.body || 'You have a new notification',
    icon: payload.icon || '/favicon.png',
    badge: payload.badge || '/favicon.png',
    data: payload.data || {},
    vibrate: payload.vibrate || [100, 50, 100],
    actions: payload.actions || []
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        try {
          const href = new URL(client.url).pathname;
          if (href === url && 'focus' in client) return client.focus();
        } catch {}
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
