import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Cytaty – PWA',
        short_name: 'Cytaty',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b1021',
        theme_color: '#0b1021',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/dummyjson\.com\/quotes.*$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-quotes',
              expiration: { 
                maxEntries: 100, 
                maxAgeSeconds: 60 * 60 * 24 * 7 
              }
            }
          },
          {
            urlPattern: /^https:\/\/dummyjson\.com\/auth.*$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-auth',
              expiration: { 
                maxEntries: 20, 
                maxAgeSeconds: 60 * 30 
              }
            }
          }
        ]
      }
    })
  ],
  
  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          store: ['zustand']
        }
      }
    },
    
    // Minifikacja
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Brak source maps w produkcji
    sourcemap: false
  }
})