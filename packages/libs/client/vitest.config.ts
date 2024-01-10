import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 92.38,
        functions: 88.88,
        branches: 94.84,
        statements: 92.38,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
