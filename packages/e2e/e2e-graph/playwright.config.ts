import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: {
    command: `pnpm --filter @kadena/graph start:generate`,
    url: 'http://localhost:4000/graphql',
    reuseExistingServer: process.env.CI === undefined,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      PORT: '4000',
      PRISMA_LOGGING_ENABLED: 'true',
      PRISMA_LOG_TO_FILE: 'true',
      PRISMA_LOG_FILENAME: 'prisma.log',
    },
  },
  projects: [
    {
      name: 'graph',
      testDir: 'tests/',
    },
  ],
};

export default config;
