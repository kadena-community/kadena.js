/// <reference types="vitest" />
/// <reference types="vite/client" />

import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer', 'process', '@kadena/client'],
    force: true,
  },
  build: {
    commonjsOptions: {
      include: [/@kadena/, /node_modules/],
      transformMixedEsModules: true,
      defaultIsModuleExports: 'auto',
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          if (id.includes('@kadena')) {
            return 'kadena';
          }
        },
      },
    },
  },
});
