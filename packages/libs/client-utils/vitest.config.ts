import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 21.32,
        functions: 68.75,
        branches: 83.56,
        statements: 21.32,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
