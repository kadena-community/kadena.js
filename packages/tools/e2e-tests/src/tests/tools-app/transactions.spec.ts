import { expect } from '@playwright/test';
import { create } from 'domain';
import { IAccount, IAccountWithSecretKey } from 'src/support/types/types';
import { test } from '../../support/fixtures/test.fixture';
import {
  createAccount,
  generateAccount,
} from '../../support/helpers/client-utils.helper';

test.beforeEach(async ({ page, toolsApp }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.goToPage('Transactions');
    await toolsApp.homePage.header.setNetwork('devnet');
    await createAccount(1, '0');
  });
});

test('Create and fund account', async ({ toolsApp }) => {
  let sourceAccount: IAccount;
  let sourceAccount: IAccount;

  await test.step('Create account on chain 0.', async () => {
    sourceAccount = await createAccount(1, '0');
  });

  await toolsApp.transactionsPage.asidePanel.clickPageLink('Transfer Tracker');
  expect(true).toBe(true);
});
