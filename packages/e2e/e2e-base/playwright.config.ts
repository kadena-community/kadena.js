import type { PlaywrightTestConfig } from '@playwright/test';
import { join } from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const baseConfig: PlaywrightTestConfig = {
  testDir: join(__dirname, 'src/tests'),
  forbidOnly: process.env.CI !== undefined,
  retries: process.env.CI !== undefined ? 1 : 0,
  workers: 1,
  reportSlowTests: null,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: process.env.CI !== undefined,
    baseURL: 'http://localhost:3000/',
    channel: 'chromium',
    trace: 'retain-on-failure',
    viewport: { width: 1920, height: 1080 },
  },
  timeout: 100000,

  expect: {
    timeout: 2 * 30000,
  },
};
