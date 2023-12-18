import { expect } from '@playwright/test';
import { accountsData } from '../../fixtures/accounts.fixture';
import { test } from '../../fixtures/test.fixture';
import { generateAccount } from '../../helpers/accounts.helper';

test('Fund existing account @mocks', async ({ page, toolsApp, i18n }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.setNetwork('devnet');
    await toolsApp.homePage.header.goToPage('Faucet');
  });

  await test.step('Fund account on chain 0.', async () => {
    await toolsApp.faucetPage.asidePanel.clickPageLink('Fund Existing Account');
    await toolsApp.faucetPage.fundExistingAccount(accountsData.publicKey, '0');
    await expect(
      page.getByText('Transaction is being processed...'),
    ).toBeVisible();

    await expect(
      page.getByText('Transaction successfully completed'),
    ).toBeVisible();
  });
});

test('fund new K: account', async ({ page, toolsApp }) => {
  const account = await generateAccount('0');
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.setNetwork('devnet');
    await toolsApp.homePage.header.goToPage('Faucet');
  });

  await test.step('Create account on chain 0.', async () => {
    await toolsApp.faucetPage.asidePanel.clickPageLink('Fund New Account');
    await toolsApp.faucetPage.fundNewAccount(account);

    await expect(
      page.getByText('Transaction is being processed...'),
    ).toBeVisible();

    await expect(
      page.getByText('Transaction successfully completed'),
    ).toBeVisible();
  });
});
