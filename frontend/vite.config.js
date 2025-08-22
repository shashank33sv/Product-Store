// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Optional: You can set a specific port for the dev server
    proxy: {
      // Proxying API requests to the backend
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,
      },
    },
  },
})