import { test as baseTest } from '@playwright/test';
import { PouAppIndex } from '../../page-objects/proof-of-us/pou.index';

export const test = baseTest.extend<{
  personA: PouAppIndex;
  personB: PouAppIndex;
}>({
  personA: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = new PouAppIndex(await context.newPage());
    await use(customPage);
    await context.close();
  },
  personB: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = new PouAppIndex(await context.newPage());
    await use(customPage);
    await context.close();
  },
});
