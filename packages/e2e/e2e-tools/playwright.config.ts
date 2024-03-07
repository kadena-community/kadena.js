import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  timeout: 180000,
  webServer: {
    command: `pnpm --filter @kadena/tools dev`,
    url: 'http://localhost:3000',
    reuseExistingServer: process.env.CI === undefined,
    timeout: 2 * 60000,
    env: {
      FAUCET_NAMESPACE: 'n_34d947e2627143159ea73cdf277138fd571f17ac',
      FAUCET_CONTRACT: 'coin-faucet',
      FAUCET_USER: 'c:zWPXcVXoHwkNTzKhMU02u2tzN_yL6V3-XTEH1uJaVY4',
    },
  },
  projects: [
    {
      name: 'setup',
      testDir: 'setup',
      testMatch: 'faucet.setup.ts',
    },
    {
      name: 'tools',
      testDir: 'tests',
      dependencies: ['setup'],
      use: {
        storageState: './setup/storageState.json',
      },
    },
  ],
};

export default config;
