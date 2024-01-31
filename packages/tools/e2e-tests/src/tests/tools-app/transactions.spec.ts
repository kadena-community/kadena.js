import { blue, red } from '@constants/colors.constants';
import { test } from '@fixtures/shared/test.fixture';
import {
  createAccount,
  generateAccount,
} from '@helpers/client-utils/accounts.helper';
import { initiateCrossChainTransfer } from '@helpers/client-utils/transfer.helper';
import { expect } from '@playwright/test';

test.beforeEach(async ({ page, toolsApp }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.setNetwork('devnet');
    await toolsApp.homePage.header.goToPage('Transactions');
  });
});

test(`Tracking a Cross Chain Transfer`, async ({ toolsApp, page }) => {
  const sourceAccount = await generateAccount(1, ['0']);
  const targetAccount = await generateAccount(1, ['1']);
  await createAccount(sourceAccount, sourceAccount.chains[0]);
  await createAccount(targetAccount, sourceAccount.chains[0]);
  const transferTask = initiateCrossChainTransfer(
    sourceAccount,
    targetAccount,
    '5',
    sourceAccount.chains[0],
    targetAccount.chains[0],
  );
  const submitRes = await transferTask.executeTo('listen');

  await test.step('Navigate to the Cross Chain Transfer tracker', async () => {
    await toolsApp.transactionsPage.aside.clickPageLink(
      'Cross Chain Transfer Tracker',
    );
  });

  await test.step('Search for the transaction', async () => {
    await toolsApp.transactionsPage.searchForTransaction(submitRes.reqKey);
  });

  await test.step('Shows Sender Information', async () => {
    await toolsApp.transactionsPage.senderCard.toggleMasking();
    await expect(
      await toolsApp.transactionsPage.senderCard.getAccount(),
    ).toHaveText(sourceAccount.account);
    await expect(
      await toolsApp.transactionsPage.senderCard.getChain(),
    ).toHaveText(sourceAccount.chains[0]);
  });

  await test.step('Progress Bar shows that the continuation is pending', async () => {
    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpointStatus(0),
    ).toHaveCSS('background-color', blue);

    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpoint(0),
    ).toHaveText('Initiated transaction');

    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpointStatus(1),
    ).toHaveCSS('background-color', red);

    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpoint(1),
    ).toHaveText('Transfer pending - waiting for continuation');
  });

  await test.step('Shows Receiver Information', async () => {
    await toolsApp.transactionsPage.receiverCard.toggleMasking();
    await expect(
      await toolsApp.transactionsPage.receiverCard.getAccount(),
    ).toHaveText(targetAccount.account);
    await expect(
      await toolsApp.transactionsPage.receiverCard.getChain(),
    ).toHaveText(targetAccount.chains[0]);
  });

  await test.step('Complete the Transaction', async () => {
    await toolsApp.transactionsPage.aside.clickPageLink(
      'Cross Chain Transfer Finisher',
    );
    await toolsApp.transactionsPage.waitForPageLoad();
    await toolsApp.transactionsPage.finishTransaction(submitRes.reqKey);
  });

  await test.step('Progress Bar shows that the continuation is finished and the transfer complete', async () => {
    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpointStatus(0),
    ).toHaveCSS('background-color', blue);

    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpoint(0),
    ).toHaveText('Initiated transaction');

    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpointStatus(1),
    ).toHaveCSS('background-color', blue);

    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpoint(1),
    ).toHaveText('Cross Chain Transfer completed');
    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpointStatus(2),
    ).toHaveCSS('background-color', blue);

    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpoint(2),
    ).toHaveText('Transfer complete');
  });
});
