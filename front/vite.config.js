import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 👈 Agar aapka backend kisi dusre port (ex: 8000, 5001) par hai, toh ise change kar lein
        changeOrigin: true,
        secure: false,
      },
    },
  },
})