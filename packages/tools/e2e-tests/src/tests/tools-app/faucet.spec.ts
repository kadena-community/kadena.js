import { expect } from '@playwright/test';
import { test } from '../../support/fixtures/test.fixture';
import {
  createAccount,
  generateAccount,
} from '../../support/helpers/client-utils.helper';

test.beforeEach(async ({ page, toolsApp }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.goToPage('Faucet');
    await toolsApp.homePage.header.setNetwork('devnet');
  });
});

const accountTypes = [
  { type: 'k:', NumberOfKeys: 1 },
  { type: 'w:', NumberOfKeys: 2 },
];

for (const accountType of accountTypes) {
  test(`Create and fund ${accountType.type} account`, async ({ toolsApp }) => {
    const account = await generateAccount(accountType.NumberOfKeys, '0');
    await test.step('Create account on chain 0.', async () => {
      await toolsApp.faucetPage.asidePanel.clickPageLink('Fund New Account');
      await toolsApp.faucetPage.CreateFundAccount(account);
      await expect(
        await toolsApp.faucetPage.notificationComponent.getTitle(),
      ).toHaveText('Transaction is being processed...');
    });
    await test.step('Account has been created', async () => {
      await expect(
        await toolsApp.faucetPage.notificationComponent.getTitle(),
      ).toHaveText('Transaction successfully completed');
    });
  });

  test(`Fund existing ${accountType.type} account`, async ({ toolsApp }) => {
    await test.step('Fund account on chain 0.', async () => {
      const createdAccount = await createAccount(accountType.NumberOfKeys, '0');
      await toolsApp.faucetPage.asidePanel.clickPageLink(
        'Fund Existing Account',
      );
      await toolsApp.faucetPage.fundExistingAccount(
        createdAccount.account,
        '0',
      );
      await expect(
        await toolsApp.faucetPage.notificationComponent.getTitle(),
      ).toHaveText('Transaction is being processed...');
    });
    await test.step('Account has been funded', async () => {
      await expect(
        await toolsApp.faucetPage.notificationComponent.getTitle(),
      ).toHaveText('Transaction successfully completed');
    });
  });
}
