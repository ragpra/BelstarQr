const CACHE_NAME = 'belstar-qr-v1';
const urlsToCache = [
  '/',
  '/BelstarQRMaker.html',
  '/manifest.json',
  // Icon files are essential for PWA to look good
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  // External library dependencies
  'https://unpkg.com/qrious@4.0.2/dist/qrious.min.js'
];

// Install event: Caches all necessary files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and adding all necessary files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Serves files from the cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request);
      })
  );
});

// Activate event: Clears old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
