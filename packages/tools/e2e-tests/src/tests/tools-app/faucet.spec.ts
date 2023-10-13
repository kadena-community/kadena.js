import { accountsData } from '../../fixtures/data/accounts';
import { pollFinished, pollInProgress } from '../../fixtures/mocks/poll';
import { send } from '../../fixtures/mocks/send';
import { test } from '../../page-objects';

import { expect } from '@playwright/test';

test('Fund existing account @mocks', async ({ page, toolsApp, mockHelper }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.setNetwork('Testnet');
    await toolsApp.homePage.header.goTo('Faucet');
  });

  await test.step('Fund account on chain 0.', async () => {
    await mockHelper.mockResponse('**/send', send);
    await toolsApp.faucetPage.fundAccount(accountsData.publicKey, '0');

    await mockHelper.mockResponse('**/poll', pollInProgress);
    await expect(page.getByText('Transaction is being processed...')).toBeVisible();

    await mockHelper.mockResponse('**/poll', pollFinished);
    await expect(page.getByText('Transaction successfully completed')).toBeVisible();

  });
});
