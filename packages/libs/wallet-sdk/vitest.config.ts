import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      exclude: ['src/gql/*.ts'],
      provider: 'v8',
      thresholds: {
        lines: 75,
        functions: 74,
        branches: 75,
        statements: 75,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
