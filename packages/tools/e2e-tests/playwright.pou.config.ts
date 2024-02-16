import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import { baseConfig } from './playwright.base.config';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  timeout: 180000,
  // webServer: {
  //   command: `pnpm --filter @kadena/proof-of-us dev`,
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: process.env.CI === undefined,
  //   timeout: 2 * 60000,
  // },
  projects: [
    {
      use: {
        ...devices['iPhone 14 Pro Max"'],
      },
      name: 'pou-setup',
      testMatch: 'setup/pou.setup.ts',
    },
    {
      use: {
        ...devices['iPhone 14 Pro Max"'],
      },
      name: 'proof-of-us',
      testDir: 'src/tests/proof-of-us/',
    },
  ],
};

export default config;
