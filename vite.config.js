import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const productionApi = 'https://api.zidash.com'
const productionProxy = {
  target: productionApi,
  changeOrigin: true,
  headers: {
    Origin: 'https://zidash.com',
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': productionProxy,
      '/socket.io': {
        ...productionProxy,
        ws: true,
      },
    },
  },
  preview: {
    proxy: {
      '/api/v1': productionProxy,
      '/socket.io': {
        ...productionProxy,
        ws: true,
      },
    },
  },
})
