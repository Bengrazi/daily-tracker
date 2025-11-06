self.addEventListener('install', event => {
  event.waitUntil(caches.open('dt-shell-v1').then(cache => cache.addAll(['/', '/manifest.json'])));
});
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
