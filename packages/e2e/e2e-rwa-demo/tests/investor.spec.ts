import type { ILoginDataRWAProps } from '@kadena-dev/e2e-base/src/page-objects/rwa-demo/RWADemoApp.index';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { test } from '../fixtures/rwa-persona.fixture';

test('Investor checks', async ({
  initiator,
  investor1,
  investor2,
  RWADemoApp,
  chainweaverApp,
}) => {
  let ownerProps: ILoginDataRWAProps;
  let investor1Props: ILoginDataRWAProps;
  let investor2Props: ILoginDataRWAProps;

  await test.step('setup the 2 accounts in the same contract', async () => {
    await RWADemoApp.setup(initiator, chainweaverApp, 'initiator');

    investor1Props = (await RWADemoApp.setup(
      investor1,
      chainweaverApp,
      'investor1',
    )) as ILoginDataRWAProps;
    investor2Props = (await RWADemoApp.setup(
      investor2,
      chainweaverApp,
      'investor2',
    )) as ILoginDataRWAProps;

    ownerProps = await RWADemoApp.setupAppend(
      initiator,
      chainweaverApp,
      'initiator',
    );

    await investor1.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );
    await investor2.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );

    await expect(true).toBe(true);
  });

  await test.step('Create investors', async () => {
    const createInvestor = async (
      actor: Page,
      investorAccountProps: ILoginDataRWAProps,
      alias: string,
    ) => {
      await actor
        .getByTestId('leftaside')
        .locator('nav > ul li:nth-child(3)')
        .click();
      await actor
        .getByTestId('investorsCard')
        .getByRole('heading', { name: 'Investors' })
        .waitFor();

      await actor
        .locator('div[data-testid="investorTable"][data-isloading="false"]')
        .waitFor({ timeout: 60000 });

      await actor.waitForTimeout(1000);

      const tr = await actor
        .locator('table > tbody tr > td:nth-child(1)')
        .all();

      await actor
        .getByTestId('investorsCard')
        .getByRole('button', { name: 'Add Investor' })
        .last()
        .click();

      const rightAside = actor.getByTestId('rightaside');
      await actor.type(
        '[name="accountName"]',
        investorAccountProps.data.data.account[0].value.address,
        { delay: 10 },
      );
      await actor.type('[name="alias"]', alias, { delay: 10 });

      const txSpinner = actor.getByTestId('investorTableTxSpinner');
      await RWADemoApp.checkLoadingIndicator(
        actor,
        txSpinner,
        chainweaverApp.signWithPassword(
          actor,
          rightAside.getByRole('button', { name: 'Add Investor' }),
        ),
      );

      // await initiator.waitForTimeout(1000000);
      const newTr = await actor
        .locator('table > tbody tr > td:nth-child(1)')
        .all();
      await expect(newTr.length).toBe(tr.length + 1);
    };

    await createInvestor(initiator, investor1Props, 'Skeletor');
    await initiator.reload();
    await createInvestor(initiator, investor2Props, 'Orko');
  });
});
