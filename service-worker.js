importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log(`Workbox berhasil dimuat`);
} else {
  console.log(`Workbox gagal dimuat`);
}

workbox.precaching.precacheAndRoute([
  {url: '/', revision: '1'},
  {url: '/index.html', revision: '1'},
  {url: '/club.html', revision: '1'},
  {url: '/nav.html', revision: '1'},
  {url: '/css/materialize.min.css', revision: '1'},
  {url: '/js/materialize.min.js', revision: '1'},
  {url: '/js/nav.js', revision: '1'},
  {url: '/js/api.js', revision: '3'},
  {url: '/js/db.js', revision: '1'},
  {url: '/js/idb.js', revision: '1'},
  {url: '/manifest.json', revision: '1'},
  {url: '/icon.png', revision: '1'},
  {url: '/icon_small.png', revision: '1'},
], {
  // Ignore all URL parameters.
  ignoreURLParametersMatching: [/.*/],
});

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    }),
);

workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'pages',
    }),
);

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org\/v2/,
    workbox.strategies.networkFirst({
      cacheName: 'football-data',
      networkTimeoutSeconds: 3,
    }),
);

self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  const options = {
    body: body,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
      self.registration.showNotification('Push Notification', options),
  );
});
