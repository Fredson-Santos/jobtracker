import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8016,
    strictPort: true,
    host: true,
    proxy: {
      '/vagas': 'http://localhost:8015',
      '/alertas': 'http://localhost:8015',
    },
  },
  preview: {
    port: 8016,
    strictPort: true,
    host: true,
  }
})
