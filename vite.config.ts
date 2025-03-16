import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/sniffer': {
        target: 'https://sniffer.okioi.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/sniffer/, '')
      }
    }
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
