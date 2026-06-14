import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'PuranPuran',
        short_name: 'PuranPuran',
        description: '일본 여행 플래너 & 가계부',
        lang: 'ko',
        theme_color: '#FF871E',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          {
            name: '여행 계획',
            short_name: '계획',
            description: '여행 계획 페이지로 이동',
            url: '/plan',
            icons: [{ src: '/shortcut-plan.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: '가계부',
            short_name: '가계부',
            description: '가계부 페이지로 이동',
            url: '/count',
            icons: [{ src: '/shortcut-budget.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: '영수증 인식',
            short_name: '영수증',
            description: '영수증 인식 페이지로 이동',
            url: '/camera',
            icons: [{ src: '/shortcut-receipt.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: '마이페이지',
            short_name: '마이페이지',
            description: '마이페이지로 이동',
            url: '/mypage',
            icons: [{ src: '/shortcut-mypage.png', sizes: '192x192', type: 'image/png' }],
          }
        ]
      },
      workbox: {
        // SPA 라우팅 폴백 — API 요청은 폴백/캐시에서 제외해 항상 네트워크로
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "map-vendor": ["leaflet", "react-leaflet"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
