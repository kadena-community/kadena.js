import { test } from '../../page-objects';
import { expect } from '@playwright/test';

test('The Module Explorer shows deployed contracts @mocks', async ({
  page,
  toolsApp,
}) => {
  await test.step('Open Tools and navigate to Transactions', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.setNetwork('Testnet');
    await toolsApp.homePage.header.goTo('Transactions');
  });

  await test.step('Navigate to Module Explorer and search for deployed contracts', async () => {
    await toolsApp.transactionsPage.aside.navigateTo('Module Explorer');
    await toolsApp.moduleExplorerPage.searchModule('coin-faucet');

    await expect(
      await toolsApp.moduleExplorerPage.getDeployedContracts(),
    ).toHaveText('user.coin-faucet');
    await toolsApp.moduleExplorerPage.openDeployedContract(
      'user.coin-faucet',
      '0',
    );
    await expect(await toolsApp.moduleExplorerPage.getEditor()).toBeVisible();
  });
});
