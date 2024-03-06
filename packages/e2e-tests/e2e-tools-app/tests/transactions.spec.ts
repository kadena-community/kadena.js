import { blue, red } from '@kadena-dev/e2e-base/src/constants/colors.constants';
import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import {
  createAccount,
  generateAccount,
} from '@kadena-dev/e2e-base/src/helpers/client-utils/accounts.helper';
import { initiateCrossChainTransfer } from '@kadena-dev/e2e-base/src/helpers/client-utils/transfer.helper';
import { expect } from '@playwright/test';

export const trackAndConfirmCrossChainTransfer = () => {
  return test(`Tracking and Finishing a Cross Chain Transfer`, async ({
    toolsApp,
    page,
  }) => {
    // Set up accounts and the transfer using Client Utils
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

    await test.step('Enable Devnet and navigate to the Cross Chain Transfer Tracker', async () => {
      await page.goto('/');
      await toolsApp.homePage.header.goToPage('Transactions');
      await toolsApp.asidePanel.navigateTo('Cross Chain Transfer Tracker');
    });

    await test.step('Search for the transaction', async () => {
      await toolsApp.crossChainTrackerPage.searchForTransaction(
        submitRes.reqKey,
      );
    });

    await test.step('Shows Sender Information', async () => {
      await toolsApp.crossChainTrackerPage.senderCard.toggleMasking();
      await expect(
        await toolsApp.crossChainTrackerPage.senderCard.getAccount(),
      ).toHaveText(sourceAccount.account);
      await expect(
        await toolsApp.crossChainTrackerPage.senderCard.getChain(),
      ).toHaveText(sourceAccount.chains[0]);
    });

    await test.step('Progress Bar shows that the continuation is pending', async () => {
      await expect(
        await toolsApp.crossChainTrackerPage.progressBar.getCheckpointStatus(0),
      ).toHaveCSS('background-color', blue);

      await expect(
        await toolsApp.crossChainTrackerPage.progressBar.getCheckpoint(0),
      ).toHaveText('Initiated transaction');

      await expect(
        await toolsApp.crossChainTrackerPage.progressBar.getCheckpointStatus(1),
      ).toHaveCSS('background-color', red);

      await expect(
        await toolsApp.crossChainTrackerPage.progressBar.getCheckpoint(1),
      ).toHaveText('Transfer pending - waiting for continuation');
    });

    await test.step('Shows Receiver Information', async () => {
      await toolsApp.crossChainTrackerPage.receiverCard.toggleMasking();
      await expect(
        await toolsApp.crossChainTrackerPage.receiverCard.getAccount(),
      ).toHaveText(targetAccount.account);
      await expect(
        await toolsApp.crossChainTrackerPage.receiverCard.getChain(),
      ).toHaveText(targetAccount.chains[0]);
    });

    await test.step('Complete the Transaction', async () => {
      await toolsApp.crossChainTrackerPage.navToFinishTransaction();
      await toolsApp.crossChainFinisherPage.finishTransaction();
      await expect(
        await toolsApp.crossChainFinisherPage.succesNotification.getComponent(),
      ).toBeVisible();
    });

    // await test.step('Progress Bar shows that the continuation is finished and the transfer complete', async () => {
    //   await expect(
    //     await toolsApp.crossChainFinisherPage.progressBar.getCheckpointStatus(0),
    //   ).toHaveCSS('background-color', blue);

    //   await expect(
    //     await toolsApp.crossChainFinisherPage.progressBar.getCheckpoint(0),
    //   ).toHaveText('Initiated transaction');

    //   await expect(
    //     await toolsApp.crossChainFinisherPage.progressBar.getCheckpointStatus(1),
    //   ).toHaveCSS('background-color', blue);

    //   await expect(
    //     await toolsApp.crossChainFinisherPage.progressBar.getCheckpoint(1),
    //   ).toHaveText('Cross Chain Transfer completed');
    //   await expect(
    //     await toolsApp.crossChainFinisherPage.progressBar.getCheckpointStatus(2),
    //   ).toHaveCSS('background-color', blue);

    //   await expect(
    //     await toolsApp.crossChainFinisherPage.progressBar.getCheckpoint(2),
    //   ).toHaveText('Transfer complete');
    // });
  });
};
