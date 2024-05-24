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
          lines: 54.78,
          functions: 44.97,
          branches: 78.22,
          statements: 54.78,
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
