import { test } from './page-objects';
import { expect } from '@playwright/test';
import { accountsData } from './fixtures/data/accounts';
import { send } from './fixtures/mocks/send';
import { pollFinished, pollInProgress } from './fixtures/mocks/poll';
import * as module from 'module';

test('The Module Explorer shows deployed contracts @mocks', async ({
  page,
  home,
  transactions,
  moduleExplorer,
}) => {
  await test.step('Open Tools and navigate to Transactions', async () => {
    await page.goto('/');
    await home.header.setNetwork('Testnet');
    await home.header.goTo('Transactions');
  });

  await test.step('Navigate to Module Explorer and search for deployed contracts', async () => {
    await transactions.aside.navigateTo('Module Explorer');
    await moduleExplorer.searchModule('coin-faucet')

    await expect(await moduleExplorer.getDeployedContracts()).toHaveText('user.coin-faucet')
    await moduleExplorer.openDeployedContract('user.coin-faucet', '0')
    await expect(await moduleExplorer.getEditor()).toBeVisible()
  });
});
