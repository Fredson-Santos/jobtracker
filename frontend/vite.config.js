import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// eslint-disable-next-line no-undef
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 8016,
      strictPort: true,
      host: env.VITE_HOST === 'true' || env.VITE_HOST,
      proxy: {
        '/api': env.VITE_API_URL || 'http://127.0.0.1:8000',
      },
    },
    preview: {
      port: parseInt(env.VITE_PORT) || 8016,
      strictPort: true,
      host: env.VITE_HOST === 'true' || env.VITE_HOST,
      allowedHosts: env.VITE_ALLOWED_HOSTS ? [env.VITE_ALLOWED_HOSTS] : [],
    }
  }
})
