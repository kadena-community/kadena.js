import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    vanillaExtractPlugin({ emitCssInSsr: true }),
  ],
  test: {
    setupFiles: ['vitest.setup.ts'],
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
