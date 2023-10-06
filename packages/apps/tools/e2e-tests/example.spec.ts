import { test } from './page-objects';
import {expect} from '@playwright/test'
import {accountsData} from './fixtures/data/accounts';

test('Fund account using the faucet', async ({ page, home, faucet }) => {
  await page.goto('/');
  await home.header.setNetwork("Testnet")
  await home.header.goTo('Faucet')
  await faucet.fundAccount(accountsData.publicKey, "0")
  await expect(await faucet.notification.getTitle()).toHaveText('Transaction is being processed...')
  await expect(await faucet.notification.getMessage()).toHaveText('Please have some patience while the transaction is being processed.')
});
