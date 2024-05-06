import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/marmalade.int.test.ts'],
    testTimeout: 60000,
  },
});
