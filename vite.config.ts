import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/icon-192x192.png', 'icons/icon-512x512.png', 'icons/icon-maskable-1024.png'],
      manifest: {
        name: 'Paleoclima Data v2',
        short_name: 'Paleoclima v2',
        description: 'Explorador de datos paleoclimáticos',
        theme_color: '#005833',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin }) => sameOrigin,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'app-assets',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: ({ request, sameOrigin }) => request.destination === 'image' && !sameOrigin,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cdn',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ]
})
