import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './', // 👈 Corrige problema dos assets na Hostinger
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 Ativa o uso de @ para /src
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // 👈 Apenas se necessário
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
