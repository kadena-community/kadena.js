import { test } from '@fixtures/shared/test.fixture';
import { initiateCrossChainTransfer } from '@helpers/client-utils/transfer.helper';
import type { ICommandResult, ITransactionDescriptor } from '@kadena/client';
import { expect } from '@playwright/test';
import type { IAccount } from 'src/support/types/accountTypes';
import {
  createAccount,
  generateAccount,
} from '../../support/helpers/client-utils/accounts.helper';

test.beforeEach(async ({ page, toolsApp }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.setNetwork('devnet');
    await toolsApp.homePage.header.goToPage('Transactions');
  });
});

test(`Tracking a Cross Chain Transfer`, async ({ toolsApp }) => {
  let sourceAccount: IAccount;
  let targetAccount: IAccount;
  let transferTask;
  let submitRes: ICommandResult;
  const blue: string = 'rgb(41, 151, 255)'; // Add explicit type annotation
  const red: string = 'rgb(255, 51, 56)'; // Add explicit type annotation
  await test.step('Given the a source and target account have been created', async () => {
    sourceAccount = await generateAccount(1, ['0']);
    targetAccount = await generateAccount(1, ['1']);
    await createAccount(sourceAccount, sourceAccount.chains[0]);
    await createAccount(targetAccount, sourceAccount.chains[0]);
  });
  await test.step('Navigate to the Cross Chain Transfer tracker and initiate a transfer through client-utils', async () => {
    await toolsApp.transactionsPage.aside.clickPageLink(
      'Cross Chain Transfer Tracker',
    );
    transferTask = await initiateCrossChainTransfer(
      sourceAccount,
      targetAccount,
      '5',
      sourceAccount.chains[0],
      targetAccount.chains[0],
    );
    submitRes = await transferTask.executeTo('listen');
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
  await test.step('First checkpoint shows that the transfer has been initiated', async () => {
    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpointStatus(0),
    ).toHaveCSS('background-color', blue);

    await expect(
      await toolsApp.transactionsPage.progressBar.getCheckpoint(0),
    ).toHaveText('Initiated transaction');
  });
  await test.step('Second checkpoint shows that the continuation is pending', async () => {
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

  await test.step('Finish the cross chain transfer through client-utils', async () => {
    // await transferTask.executeTo();
  });
});
