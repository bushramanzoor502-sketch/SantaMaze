import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/SantaMazeWeb/").
// Locally the site is served from the root.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    // three.js is lazy-loaded on its own (~140 kB gzip); everything else is small.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about/index.html'),
        privacy: resolve(import.meta.dirname, 'privacy-policy/index.html'),
        contact: resolve(import.meta.dirname, 'contact/index.html'),
      },
    },
  },
});
