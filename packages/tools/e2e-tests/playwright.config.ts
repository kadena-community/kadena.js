import { defineConfig } from '@playwright/test';
import path from 'path';
const __dirname = path.resolve();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: path.join(__dirname, 'src/tests'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 1,
  reporter: process.env.CI
    ? [['github'], ['dot'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    headless: !!process.env.CI,
    baseURL: process.env.PLAYWRIGHT_BASE_URL
      ? process.env.PLAYWRIGHT_BASE_URL
      : 'http://localhost:3000',
    channel: 'chromium',
    trace: 'retain-on-failure',
  },
  timeout: 10 * 10000,
  expect: {
    timeout: 1 * 30000,
  },
  webServer: {
    command: `pnpm --filter ${process.env.TESTOBJECT} run start`,
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: process.env.CI === undefined,
  },

  projects: [
    {
      name: 'setup',
      testMatch: 'setup/faucet.setup.ts',
    },
    {
      name: '@kadena/tools',
      testDir: 'src/tests/tools-app/',
      dependencies: ['setup'],
      use: {
        storageState: './src/support/page-objects/tools-app/storageState.json',
      },
    },
  ],
});
