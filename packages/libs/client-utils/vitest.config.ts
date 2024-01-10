import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 20.71,
        functions: 67.69,
        branches: 82.99,
        statements: 20.71,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
