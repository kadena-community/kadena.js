import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  baseConfig,
  test: {
    include: ['src/**/*.test.ts'],
    setupFiles: ['./vitest.setup.js', './src/test-setup.ts'],
    threads: false, // To prevent error in tests using jsdom environment: Module did not self-register: canvas.node
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/mocks/**'],
    },
  },
});
