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
        '/api': {
          target: (() => {
            const target = env.VITE_API_URL || 'http://127.0.0.1:8015';
            return target;
          })(),
          changeOrigin: true,
          secure: false,
        }
      },
    },
    preview: {
      port: parseInt(env.VITE_PORT) || 8016,
      strictPort: true,
      host: env.VITE_HOST === 'true' || env.VITE_HOST,
      allowedHosts: ['jobtracker.conekta.tech', 'localhost', '192.168.1.100'],
    }
  }
})
