import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [vanillaExtractPlugin({ emitCssInSsr: true })],
    test: {
      globals: true,
      globalSetup: './vitest-globals.ts',
      setupFiles: ['vitest.setup.ts'],
      environment: 'happy-dom',
      coverage: {
        provider: 'v8',
        thresholds: {
          lines: 61.33,
          functions: 58.57,
          branches: 84.17,
          statements: 61.33,
        },
        exclude: [
          'src/**/*.tsx',
          'src/**/*.d.ts',
          'src/**/__fixtures__/**/*.ts',
          'src/components/**/index.ts',
          'src/**/*.css.ts',
          'src/**/*.md',
          'src/**/*.mdx',
        ],
      },
    },
  }),
);
