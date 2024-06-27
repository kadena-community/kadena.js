import baseConfig from '@kadena-dev/shared-config/vitest.config';
import path from 'path';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      exclude: [],
      provider: 'v8',
      thresholds: {},
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
