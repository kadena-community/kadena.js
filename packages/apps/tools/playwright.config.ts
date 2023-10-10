import { defaultConfig } from '@kadena-dev/heft-rig/playwright.config.base';
import { defineConfig } from "@playwright/test";

export default defineConfig({
    ...defaultConfig,
    webServer: {
      command: 'pnpm run start',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: false,
      stdout: 'ignore',
      stderr: 'ignore',
    }
  }
);
