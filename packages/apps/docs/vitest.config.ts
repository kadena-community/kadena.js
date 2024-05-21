import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [vanillaExtractPlugin({ emitCssInSsr: true })],
    test: {
      globals: true,
      setupFiles: ['vitest.setup.ts'],
      environment: 'happy-dom',
      coverage: {
        provider: 'v8',
        thresholds: {
          lines: 0,
          functions: 0,
          branches: 0,
          statements: 0,
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
