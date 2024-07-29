import type { Page } from '@playwright/test';
import { test as baseTest } from '@playwright/test';

export const test = baseTest.extend<{
  initiator: Page;
  signer1: Page;
  signer2: Page;
  signer3: Page;
  signer4: Page;
  signer5: Page;
  signer6: Page;
  signer7: Page;
  signer8: Page;
  signer9: Page;
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
  signer2: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  signer3: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  signer4: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  signer5: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  signer6: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  signer7: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  signer8: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
  signer9: async ({ browser }, use) => {
    const context = await browser.newContext();
    const customPage = await context.newPage();
    await use(customPage);
    await context.close();
  },
});
