import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts', 'src/interfaces/async-pipe-type.ts'],
    coverage: {
      exclude: [
        // we have integration for this
        'src/coin/**/*',
        // we have integration for this
        'src/built-in/**/*',
        // we have integration for this
        'src/core/estimate-gas.ts',
        // its just type
        'src/interfaces/async-pipe-type.ts',
        // its just type and I have a test for that
        'src/core/utils/types.ts',
        // its a script that generates the asyncPipe type
        'src/scripts/**/*',
      ],
      provider: 'v8',
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
