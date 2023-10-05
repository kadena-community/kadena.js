import { test } from '../../page-objects';
import { expect } from '@playwright/test';
test('has title', async ({ page, tools }) => {
  await page.goto('/');
  await tools.startPage.header.goTo('Faucet')
  await expect(await tools.startPage.header.getNetwork()).toHaveText("Mainnet");
  await tools.startPage.header.addNetwork('Devnet', 'fast-development', 'localhost:8080')
  await expect(await tools.startPage.header.getNetwork()).toHaveText("Devnet");
});
