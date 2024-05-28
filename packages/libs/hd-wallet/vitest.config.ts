/**
 * Test configuration for hd-wallet; read ADR-0002 for more information.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // we exclude the chainweaver tests since there is another config for it
    exclude: ['src/chainweaver/**/*.test.ts'],
    testTimeout: 5000,
    include: ['src/**/*.test.ts'],
    setupFiles: './vitest.setup.js',
  },
});
