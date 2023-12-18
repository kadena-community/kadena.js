import { expect } from '@playwright/test';
import { test } from '../../fixtures/test.fixture';
import { createAccountOnChain, generateAccount } from '../../helpers/accounts.helper';

test.beforeEach( async ({page, toolsApp}) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.setNetwork('devnet');
    await toolsApp.homePage.header.goToPage('Faucet');
  });
})

test('fund new K: account', async ({ page, toolsApp }) => {
  const account = await generateAccount('0');
  await test.step('Create account on chain 0.', async () => {
    await toolsApp.faucetPage.asidePanel.clickPageLink('Fund New Account');
    await toolsApp.faucetPage.fundNewAccount(account);
    await expect(await toolsApp.faucetPage.notificationComponent.getTitle()).toHaveText('Transaction is being processed...')
  });
  await test.step('Account has been created', async () => {
    await expect(await toolsApp.faucetPage.notificationComponent.getTitle()).toHaveText('Transaction successfully completed')
  });
});

test('Fund existing account', async ({ page, toolsApp, i18n }) => {
  await test.step('Fund account on chain 0.', async () => {
    const account = await createAccountOnChain('0')
    await toolsApp.faucetPage.asidePanel.clickPageLink('Fund Existing Account');
    await toolsApp.faucetPage.fundExistingAccount(account.account, '0');
    await expect(await toolsApp.faucetPage.notificationComponent.getTitle()).toHaveText('Transaction is being processed...')
  });
  await test.step('Account has been funded', async () => {
    await expect(await toolsApp.faucetPage.notificationComponent.getTitle()).toHaveText('Transaction successfully completed')
  });
});
