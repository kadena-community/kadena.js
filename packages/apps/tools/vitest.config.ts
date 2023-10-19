import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    vanillaExtractPlugin({ emitCssInSsr: true }),
  ],
  test: {
    setupFiles: ['vitest.setup.ts'],
    globals: true,
    environment: 'happy-dom',
    threads: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
