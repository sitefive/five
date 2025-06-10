import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin/, to: '/index.html' },
        { from: /^\/pt/, to: '/index.html' },
        { from: /^\/en/, to: '/index.html' },
        { from: /^\/es/, to: '/index.html' },
      ]
    }
  },
  preview: {
    port: 3000,
    host: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin/, to: '/index.html' },
        { from: /^\/pt/, to: '/index.html' },
        { from: /^\/en/, to: '/index.html' },
        { from: /^\/es/, to: '/index.html' },
      ]
    }
  },
  publicDir: 'public'
});