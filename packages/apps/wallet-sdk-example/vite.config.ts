import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    rollupOptions: {
      external: ['encoding'],
    },
  },
});
