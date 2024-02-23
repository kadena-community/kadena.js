import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import {
  createAccount,
  generateAccount,
} from '@kadena-dev/e2e-base/src/helpers/client-utils/accounts.helper';
import { expect } from '@playwright/test';

test.beforeEach(async ({ page, toolsApp }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    //await toolsApp.homePage.header.setNetwork('devnet');
    await toolsApp.homePage.header.goToPage('Faucet');
  });
});

// const accountTypes = [
//   { type: 'k:', NumberOfKeys: 1 },
//   { type: 'w:', NumberOfKeys: 2 },
// ];

interface AccountTypes {
  type: string;
  numberOfKeys: number;
}

export const createFundAccount = ({ type, numberOfKeys }: AccountTypes) => {
  return test(`Create and fund ${type} account`, async ({ toolsApp }) => {
    const account = await generateAccount(numberOfKeys, ['0']);
    await test.step('Create account on chain 0.', async () => {
      await toolsApp.fundNewAccountPage.asidePanel.navigateTo(
        'Fund New Account',
      );
      await toolsApp.fundNewAccountPage.CreateFundAccount(account);
      await expect(
        await toolsApp.fundNewAccountPage.processingNotification.getComponent(),
      ).toBeVisible();
    });
    await test.step('Account has been created', async () => {
      await expect(
        await toolsApp.fundNewAccountPage.transactionFinishedNotification.getComponent(),
      ).toBeVisible();
    });
  });
};

export const fundExistingAccount = ({ type, numberOfKeys }: AccountTypes) => {
  return test(`Fund existing ${type} account`, async ({ toolsApp }) => {
    await test.step('Fund account on chain 0.', async () => {
      const account = await generateAccount(numberOfKeys, ['0']);
      await createAccount(account, '0');
      await toolsApp.asidePanel.navigateTo('Fund Existing Account');
      await toolsApp.fundExistingAccountPage.fundExistingAccount(
        account.account,
        '0',
      );

      await expect(
        await toolsApp.fundNewAccountPage.processingNotification.getComponent(),
      ).toBeVisible();
    });
    await test.step('Account has been funded', async () => {
      await expect(
        await toolsApp.fundNewAccountPage.transactionFinishedNotification.getComponent(),
      ).toBeVisible();
    });
  });
};
