import type { ILoginDataRWAProps } from '@kadena-dev/e2e-base/src/page-objects/rwa-demo/RWADemoApp.index';
import { expect } from '@playwright/test';
import { test } from '../fixtures/rwa-persona.fixture';

test('Investor checks', async ({
  initiator,
  investor1,
  RWADemoApp,
  chainweaverApp,
}) => {
  let ownerProps: ILoginDataRWAProps;
  let investor1Props: ILoginDataRWAProps;

  await test.step('setup the 2 accounts in the same contract', async () => {
    await RWADemoApp.setup(initiator, chainweaverApp, 'initiator');

    investor1Props = (await RWADemoApp.setup(
      investor1,
      chainweaverApp,
      'investor1',
    )) as ILoginDataRWAProps;

    ownerProps = await RWADemoApp.setupAppend(
      initiator,
      chainweaverApp,
      'initiator',
    );

    await investor1.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );

    await expect(true).toBe(true);
  });

  await test.step('Create investors', async () => {
    await initiator
      .getByTestId('leftaside')
      .locator('nav > ul li:nth-child(3)')
      .click();
    await initiator
      .getByTestId('investorsCard')
      .getByRole('heading', { name: 'Investors' })
      .waitFor();

    await initiator
      .locator('div[data-testid="investorTable"][data-isloading="false"]')
      .waitFor({ timeout: 60000 });

    await initiator.waitForTimeout(1000);

    const tr = await initiator.locator('table > tbody tr').all();
    await expect(tr.length).toBe(0);

    await initiator
      .getByTestId('investorsCard')
      .getByRole('button', { name: 'Add Investor' })
      .last()
      .click();

    const rightAside = initiator.getByTestId('rightaside');
    await initiator.type(
      '[name="accountName"]',
      investor1Props.data.data.account[0].value.address,
      { delay: 10 },
    );
    await initiator.type('[name="alias"]', 'skeletor', { delay: 10 });

    const txSpinner = initiator.getByTestId('investorTableTxSpinner');
    await RWADemoApp.checkLoadingIndicator(
      initiator,
      txSpinner,
      chainweaverApp.signWithPassword(
        initiator,
        rightAside.getByRole('button', { name: 'Add Investor' }),
      ),
    );

    // await initiator.waitForTimeout(1000000);
    const newTr = await initiator
      .locator('table > tbody tr > td:nth-child(1)')
      .all();
    await expect(newTr.length).toBe(1);
  });
});
