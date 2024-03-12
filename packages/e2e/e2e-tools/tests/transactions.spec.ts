import { blue, red } from '@kadena-dev/e2e-base/src/constants/colors.constants';
import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import {
  createAccount,
  generateAccount,
} from '@kadena-dev/e2e-base/src/helpers/client-utils/accounts.helper';
import { initiateCrossChainTransfer } from '@kadena-dev/e2e-base/src/helpers/client-utils/transfer.helper';
import {
  RecordStore,
  openTransportReplayer,
} from '@ledgerhq/hw-transport-mocker';
import { expect } from '@playwright/test';

test(`Tracking and Finishing a Cross Chain Transfer`, async ({
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
    await toolsApp.crossChainTrackerPage.searchForTransaction(submitRes.reqKey);
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

// Configure mock API before each test.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(async () => {
    console.log('Adding init script');

    // class TestDevice extends HIDDevice {
    //   public constructor() {
    //     super();
    //   }
    //   public sendReport(): Promise<void> {
    //     console.log('Sending Report', { THISLOG: this });
    //     this.dispatchEvent(
    //       new HIDInputReportEvent('inputreport', {
    //         data: new Uint8Array([0x00, 0x01, 0x02]),
    //         reportId: 0x01,
    //         device: this,
    //       }),
    //     );
    //     return Promise.resolve(undefined);
    //   }
    // }

    // const LedgerNano = {
    //   deviceId: 'mock-device-id',
    //   name: 'Ledger Nano S Plus',
    //   vendorId: 0x2c97,
    //   productId: 0x0001,
    //   open: async () => {
    //     return Promise.resolve(undefined);
    //   },
    //   addEventListener: () => {},
    //   sendReport: async () => {
    //     return Promise.resolve(undefined);
    //   },
    // };
    //TOOD: Figure out how to 'return' a Ledger Nano S Plus
    // const transport = await openTransportReplayer(
    //   RecordStore.fromString(`
    // => 0002000015052c00008072020080020000800000000000000000
    // <= 4104df00ad3869baad7ce54f4d560ba7f268d542df8f2679a5898d78a690c3db8f9833d2973671cb14b088e91bdf7c0ab00029a576473c0e12f84d252e630bb3809b28436241393833363265313939633431453138363444303932334146393634366433413634383435319000
    // `),
    // );
    // Override the method to always return mock battery info.
    window.navigator.hid.requestDevice = async () => {
      console.log('Requesting Device');
      // const LedgerNano = new EventTarget();
      // LedgerNano.open = async function () {
      //   console.log('Opening Device', { THISLOG: this });
      //   return Promise.resolve(undefined);
      // };
      // LedgerNano.sendReport = async function () {
      //   console.log('Sending Report', { THISLOG: this });
      //   LedgerNano.dispatchEvent(
      //     new HIDInputReportEvent('inputreport', {
      //       data: new DataView(new ArrayBuffer(2)),
      //       reportId: 0,
      //       device: LedgerNano,
      //     }),
      //   );
      //   return Promise.resolve(undefined);
      // };
      // return LedgerNano;
      console.log('blub');
    };
  });
});

test(`Ledger: Transfer to new account`, async ({ toolsApp, page }) => {
  await test.step('Enable Devnet and navigate to the Transfer Page', async () => {
    await page.goto('/');
    await toolsApp.homePage.header.goToPage('Transactions');
    await toolsApp.asidePanel.navigateTo('Transfer');
  });

  await test.step('Set Sender Details', async () => {
    const sourceAccount = await generateAccount(1, ['0']);
    await createAccount(sourceAccount, sourceAccount.chains[0]);

    await toolsApp.transferPage.setSender('Ledger');
    await toolsApp.transferPage.setKeyIndex('0');

    await page
      .locator('id=sender-account-name')
      .fill(sourceAccount.account, { force: true });
    //await toolsApp.transferPage.setSenderAccount(sourceAccount.account);
    //  await toolsApp.transferPage.setChainId('sender', '0');
    await toolsApp.transferPage.setAmount('1');
  });

  await test.step('Set Receiver Details', async () => {
    await toolsApp.transferPage.setReceiverTab('New');
    await toolsApp.transferPage.setPublicKey('TODO'); //TODO: Add public key
    //   await toolsApp.transferPage.setChainId('receiver', '0');
  });

  await test.step('Sign Transaction', async () => {
    await toolsApp.transferPage.signTransaction();
  });

  expect(true).toBe(true);
});
