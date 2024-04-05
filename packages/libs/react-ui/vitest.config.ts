import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  plugins: [vanillaExtractPlugin({ emitCssInSsr: true })],
  test: {
    setupFiles: ['vitest.setup.ts'],
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      include: ['**/src/**.{test,spec}.{ts,tsx}'],
      exclude: [
        '**/{Icon,entries,styles,storyDecorators}/**',
        '**/*.css.ts',
        '**/*.stories.*',
      ],
      thresholds: {
        lines: 30.0,
        functions: 20.0,
        branches: 60.0,
        statements: 30.0,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
