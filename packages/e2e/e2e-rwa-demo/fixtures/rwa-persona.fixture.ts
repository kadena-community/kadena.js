import { test as baseTest } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import type { Page } from '@playwright/test';

export const test = baseTest.extend<{
  agent1: Page;
  investor1: Page;
  investor2: Page;
}>({
  agent1: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  investor1: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  investor2: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
});
