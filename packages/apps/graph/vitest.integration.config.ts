import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['integration-tests/**/*.int.test.ts'],
    testTimeout: 60000,
  },
});
