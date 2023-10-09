import { test } from './page-objects';
import {expect} from '@playwright/test'
import {accountsData} from './fixtures/data/accounts';
import { send } from './fixtures/mocks/send'
import { pollFinished, pollInProgress } from './fixtures/mocks/poll';

test('Fund account using the faucet @mocks', async ({ page, home, faucet , mockHelper}) => {

  await page.goto('/');
  await home.header.setNetwork("Testnet")
  await home.header.goTo('Faucet')

  await mockHelper.mockResponse('**/send', send)
  await faucet.fundAccount(accountsData.publicKey, "0")


  await mockHelper.mockResponse('**/poll', pollInProgress)
  await expect(await faucet.notification.getTitle()).toHaveText('Transaction is being processed...')
  await mockHelper.mockResponse('**/poll', pollFinished)
  await expect(await faucet.notification.getTitle()).toHaveText('Transaction successfully completed')
});
