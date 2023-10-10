/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

import { PlaywrightTestConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const  defaultConfig: PlaywrightTestConfig = {
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 1,
  reporter: [['github'],['list'], ['html', { open: 'never' }]],
  use: {
    headless: !!process.env.CI,
    baseURL: process.env.PLAYWRIGHT_BASE_URL
      ? process.env.PLAYWRIGHT_BASE_URL
      : 'http://127.0.0.1:3000',
    channel: 'chromium',
    trace: `retain-on-failure`,
  },
  expect: {
    timeout: 10 * 1000,
  },
  webServer: {
    command: 'pnpm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    env: {
      FAUCET_PUBLIC_KEY: "782127638ab9cc8fa8598ff0120464ceef6f367ddcd616b47afffbdb175dcc5e",
      FAUCET_PRIVATE_KEY: "93fd78bd1e79a3b593d4732b76050b418aeefa5e4e6ea80f351b4c3a5b0dd19f"
    }
  },
};




