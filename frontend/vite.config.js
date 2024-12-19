import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});

/**
 * The proxy key inside server tells Vite to forward requests starting with /api
 * to the target server (http://localhost:8000). This way, your frontend will
 * route /api requests to the backend, avoiding CORS issues during development.
 */
