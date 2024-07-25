import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [vanillaExtractPlugin({ emitCssInSsr: true }), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      globalSetup: './vitest-globals.ts',
      setupFiles: ['vitest.setup.ts'],
      environment: 'happy-dom',
      coverage: {
        provider: 'v8',
        thresholds: {
          lines: 50,
          functions: 50,
          branches: 50,
          statements: 50,
        },
        exclude: [
          'src/**/*.tsx',
          'src/**/*.d.ts',
          'src/**/__fixtures__/**/*.ts',
          'src/graphql/**/*.ts',
          'src/**/*.graph.ts',
          'src/__generated__/**/*.ts',
          'src/__mocks__/**/*.ts',
          'src/config/**/*',
          'src/components/**/index.ts',
          'src/**/*.css.ts',
          'src/**/*.md',
          'src/**/*.mdx',
          'src/instrumentation.ts',
        ],
      },
    },
  }),
);
