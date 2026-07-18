import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Site published at https://jgemanuel.github.io/PipocaGym/
export default defineConfig({
  base: '/PipocaGym/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pipoca Gym',
        short_name: 'Pipoca',
        description: 'App de treino para Emanuel e Josana',
        theme_color: '#f59e0b',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/PipocaGym/',
        start_url: '/PipocaGym/',
        icons: [
          { src: '/PipocaGym/pwa-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/PipocaGym/pwa-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: '/PipocaGym/pwa-maskable-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'maskable' },
          { src: '/PipocaGym/pwa-maskable-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
        screenshots: [
          { src: '/PipocaGym/screenshot-1.svg', sizes: '540x720', type: 'image/svg+xml', form_factor: 'narrow' },
        ],
        categories: ['fitness', 'health'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/ibcimbyahddjllhcchhv\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }),
  ],
})
