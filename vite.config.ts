import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { it } from './src/i18n/it.ts';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// PLACEHOLDER colors: final palette is decided in Phase 9.
const THEME_COLOR = '#4338ca';
const BACKGROUND_COLOR = '#fafafc';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // New deploys replace the old service worker and reload open tabs on next navigation.
      registerType: 'autoUpdate',
      // No service worker in `npm run dev`: it only exists in production builds.
      devOptions: { enabled: false },
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: it.common.appName,
        short_name: it.common.appName,
        lang: 'it',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: THEME_COLOR,
        background_color: BACKGROUND_COLOR,
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the app shell; data caching comes in Phase 8.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
});
