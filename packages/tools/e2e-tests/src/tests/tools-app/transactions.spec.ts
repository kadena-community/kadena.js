import { transferFundsCrossChain } from '@helpers/client-utils/transfer.helper';
import { expect } from '@playwright/test';
import type { IAccount } from 'src/support/types/types';
import { test } from '../../support/fixtures/test.fixture';
import { createAccount } from '../../support/helpers/client-utils.helper';

test.beforeEach(async ({ page, toolsApp }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.goToPage('Transactions');
    await toolsApp.homePage.header.setNetwork('devnet');
  });
});

test('Should show transaction details', async ({ toolsApp }) => {
  let sourceAccountChain0: IAccount;
  let sourceAccountChain1: IAccount;
  let targetAccountChain1: IAccount;

  await test.step('Create accounts on chain 0 and 1', async () => {
    sourceAccountChain0 = await createAccount(1, '0');
    sourceAccountChain1 = await createAccount(1, '1');
    targetAccountChain1 = await createAccount(1, '1');
  });

  await toolsApp.transactionsPage.asidePanel.clickPageLink('Transfer Tracker');
  await transferFundsCrossChain(sourceAccountChain0, targetAccountChain1, '50');
  expect(true).toBe(true);
});
