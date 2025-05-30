import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // 👈 Isso resolve o problema dos assets na Hostinger!
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
