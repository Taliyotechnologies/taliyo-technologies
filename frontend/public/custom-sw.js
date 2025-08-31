// Service Worker for Taliyo Technologies
const CACHE_NAME = 'taliyo-cache-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/taliyo logo.png',
  '/taliyo_technologies_logo.png',
  '/src/assets/hero-bg.jpg',
  // Add other critical assets here
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_URLS);
      })
  );
  // Activate the service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients
  event.waitUntil(clients.claim());
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those to Google Analytics
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If we got a valid response, cache it
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // If fetch fails, try to serve from cache
          return caches.match('/')
            .then(response => response || caches.match(OFFLINE_URL));
        })
    );
  } else {
    // For all other requests, try cache first, then network
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          
          // Clone the request
          const fetchRequest = event.request.clone();
          
          // Make network request
          return fetch(fetchRequest).then(
            response => {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clone the response
              const responseToCache = response.clone();
              
              // Cache the response
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
                
              return response;
            }
          );
        })
    );
  }
});

// Handle background sync (for offline form submissions, etc.)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    // Handle form sync
    console.log('Background sync for forms');
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  const title = 'Taliyo Technologies';
  const options = {
    body: event.data.text(),
    icon: '/taliyo_technologies_logo.png',
    badge: '/taliyo_technologies_logo.png'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
