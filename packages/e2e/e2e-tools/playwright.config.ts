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
      QA_LEDGER_MOCK: 'enabled',
      QA_LEDGER_MOCKED_PUBKEY:
        'b5b519c5369bd5b53008d3c28967f4da8752363ba7eb76dfd637e21c0a1764af',
      QA_LEDGER_MOCKED_PRIVATEKEY:
        'd81a36f4cafa525d08e02275524d3dc1adddeaf304943d357e21d4f854eabc6f',
    },
  },
  projects: [
    {
      name: 'setup',
      testDir: 'setup',
      testMatch: 'devnet.setup.ts',
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
