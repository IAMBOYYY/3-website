import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/3-website/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
})