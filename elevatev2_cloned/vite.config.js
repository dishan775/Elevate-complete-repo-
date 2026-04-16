import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/api/user': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/api/sessions': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/api/english': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/api/programming': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/api/cs': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
