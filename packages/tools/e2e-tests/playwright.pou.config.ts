import type { PlaywrightTestConfig } from '@playwright/test';
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
      name: 'pou-setup',
      testMatch: 'setup/pou.setup.ts',
      use: {
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'proof-of-us',
      testDir: 'src/tests/proof-of-us/',
      use: {
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        defaultBrowserType: 'chromium',
      },
    },
  ],
};

export default config;
