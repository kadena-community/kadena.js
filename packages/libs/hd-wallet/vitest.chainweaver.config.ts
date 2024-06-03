/**
 * Test configuration for Chainweaver; read ADR-0002 for more information.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30000, // TODO: this should be investigated and reduced
    include: ['src/chainweaver/**/*.test.ts'],
    setupFiles: './vitest.setup.js',
  },
});
