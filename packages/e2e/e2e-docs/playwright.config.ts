import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  reporter:
    process.env.CI !== undefined
      ? [['list'], ['blob', {outputFile: 'blob-docs.zip'}]]
      : [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: `pnpm --filter @kadena/docs start`,
    url: 'http://localhost:3000',
    reuseExistingServer: process.env.CI === undefined,
  },
  projects: [
    {
      name: 'docs',
      testDir: 'tests',
    },
  ],
};

export default config;
