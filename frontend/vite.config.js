import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/vagas': 'http://localhost:8015',
      '/alertas': 'http://localhost:8015',
    },
  },
})
