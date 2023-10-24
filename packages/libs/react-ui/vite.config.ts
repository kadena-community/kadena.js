import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({ emitCssInSsr: true }),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
  ],
});
