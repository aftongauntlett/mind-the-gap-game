import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src/app'),
      '@core': resolve(__dirname, './src/core'),
      '@engine': resolve(__dirname, './src/engine'),
      '@game': resolve(__dirname, './src/game'),
      '@ui': resolve(__dirname, './src/ui'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'es2020',
  },
});
