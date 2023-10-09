import { defaultConfig } from '@kadena-dev/heft-rig/playwright.config.base';
import { defineConfig } from "@playwright/test";

export default defineConfig({
  ...defaultConfig,
  use: {
    ...defaultConfig.use,
    trace: 'retain-on-failure'
  },
  webServer: {
    ...defaultConfig.webServer
  },
  expect: {
    ...defaultConfig.expect
  }
});
