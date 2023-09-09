import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),],
  server: {    proxy: {      '/api': {        target: 'http://localhost:3001',        changeOrigin: true,      },    }  },
})
