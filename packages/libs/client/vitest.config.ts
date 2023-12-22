import baseConfig  from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 97.93,
        functions: 91.15,
        branches: 95.34,
        statements: 97.93,
        autoUpdate: true,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
