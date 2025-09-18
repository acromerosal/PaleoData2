const CACHE_NAME = 'offline-data-collector-v12';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/public/manifest.json',
  '/public/icons/icon-192x192.png',
  '/public/icons/icon-512x512.png',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/services/localDb.ts',
  '/components/DataForm.tsx',
  '/components/DataList.tsx',
  '/components/StatusIndicator.tsx',
  '/components/icons/Icons.tsx',
  '/components/FormElements.tsx',
  '/components/QrCodeModal.tsx',
  '/components/UserManual.tsx',
  '/components/PermissionsModal.tsx',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react-dom@^19.1.1/client',
  'https://esm.sh/dexie@^4.2.0',
  'https://esm.sh/dexie-react-hooks@^4.2.0',
  'https://esm.sh/qrcode@^1.5.3',
  'https://upload.wikimedia.org/wikipedia/commons/d/dd/Carlsbad_Interior_Formations.jpg',
  'https://www.sgc.gov.co/static/media/logoWhite.dacc0ba6b2cd29a071d738e6fbaa4a62.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Failed to cache resources:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  // Ignorar las peticiones que no son GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache-First Strategy
        return response || fetch(event.request).then(fetchResponse => {
            // No cachear respuestas opacas (de CDNs sin CORS) para evitar problemas.
            if (fetchResponse.type === 'opaque') {
                return fetchResponse;
            }
            // Opcional: añadir nuevas peticiones al caché dinámicamente
            // return caches.open(CACHE_NAME).then(cache => {
            //   cache.put(event.request, fetchResponse.clone());
            //   return fetchResponse;
            // });
            return fetchResponse;
        });
      })
  );
});

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