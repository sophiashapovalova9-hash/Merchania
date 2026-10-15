import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: true,
    // всё, что начинается с /api, уходит на бэкенд (см. FRONTEND.md)
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
