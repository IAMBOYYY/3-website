import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base stays '/' for local preview (localhost:5000).
// The GitHub Actions Pages workflow sets GH_PAGES=true so the project page
// at https://IAMBOYYY.github.io/3-website/ resolves its assets correctly.
const base = process.env.GH_PAGES ? '/3-website/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Rollup 4 dropped the object form of manualChunks; use the function form.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@react-three') || id.includes('/three/') || id.includes('three-')) {
            return 'three';
          }
          if (
            id.includes('framer-motion') ||
            id.includes('gsap') ||
            id.includes('lenis') ||
            id.includes('locomotive')
          ) {
            return 'motion';
          }
          return undefined;
        },
      },
    },
  },
})
