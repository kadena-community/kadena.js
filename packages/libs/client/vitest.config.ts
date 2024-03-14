import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      exclude: [
        // Type only files
        'src/client/interfaces/interfaces.ts',
        'src/interfaces/IPactCommand.ts',
        'src/interfaces/ISigningRequest.ts',
        'src/interfaces/type-utilities.ts',
      ],
      provider: 'v8',
      thresholds: {
        lines: 99,
        functions: 92,
        branches: 96,
        statements: 99,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
