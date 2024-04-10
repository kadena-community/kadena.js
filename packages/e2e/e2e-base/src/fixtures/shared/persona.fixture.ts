import type { Page} from '@playwright/test';
import { test as baseTest } from '@playwright/test';


export const test = baseTest.extend<{
    initiator: Page
    signer1: Page
}>({
    initiator: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  signer1: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
})