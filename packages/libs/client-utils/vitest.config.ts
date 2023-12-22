import baseConfig  from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 99.33,
        functions: 95.65,
        branches: 95.31,
        statements: 99.33,
        autoUpdate: true,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
