import type { ILoginDataRWAProps } from '@kadena-dev/e2e-base/src/page-objects/rwa-demo/RWADemoApp.index';
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

    ownerProps = await RWADemoApp.setupAppend(
      initiator,
      chainweaverApp,
      'initiator',
    );

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

    await investor1.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );
    await investor2.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );

    await expect(true).toBe(true);
  });

  await test.step('Create investors', async () => {
    await RWADemoApp.createInvestor(
      initiator,
      investor1Props,
      'Skeletor',
      chainweaverApp,
    );
    await initiator.reload();
    await RWADemoApp.createInvestor(
      initiator,
      investor2Props,
      'Orko',
      chainweaverApp,
    );

    // needed to test all the functionality for investors admin
    await RWADemoApp.createAgent(
      initiator,
      ownerProps,
      'He-man',
      chainweaverApp,
    );
  });

  await test.step('Freeze an investor', async () => {
    const FROZENMESSAGE = 'the investor account is frozen';
    await initiator.goto('/investors');

    await initiator
      .locator('div[data-testid="investorTable"][data-isloading="false"]')
      .waitFor({ timeout: 60000 });

    const tableTds = initiator
      .getByTestId('investorTable')
      .locator('table > tbody tr:has(td:nth-child(1))')
      .nth(0);
    const firstRow = tableTds.nth(0);

    await firstRow.waitFor();
    const trigger = firstRow.getByTestId('freezeAccountTrigger');
    await trigger.waitFor();
    await trigger.click();

    await expect(trigger.locator('[data-frozenState="false"]')).toBeVisible();

    // check that the popup is there
    await initiator
      .getByRole('heading', { name: 'Freeze the account' })
      .waitFor();
    await initiator.fill('[name="message"]', FROZENMESSAGE);

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      trigger,
      chainweaverApp.signWithPassword(
        initiator,
        initiator.getByRole('button', { name: 'Freeze' }),
      ),
    );

    await expect(trigger.locator('[data-frozenState="true"]')).toBeVisible();

    //check if the message exists in the frozen account
    await investor1.reload();
    await investor1.getByRole('heading', { name: FROZENMESSAGE }).waitFor();
    await expect(
      investor1.getByRole('heading', { name: FROZENMESSAGE }),
    ).toBeVisible();

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      trigger,
      chainweaverApp.signWithPassword(initiator, trigger),
    );

    //check if the message exists in the frozen account
    await investor1.reload();
    await investor1
      .getByRole('heading', { name: FROZENMESSAGE })
      .waitFor({ state: 'detached' });

    await expect(trigger.locator('[data-frozenState="false"]')).toBeVisible();
  });

  await test.step('Batch Freeze an investor', async () => {
    await initiator.goto('/investors');

    const FROZENMESSAGE = 'The investor account is frozen';
    const freezeButton = initiator
      .getByTestId('investorsCard')
      .getByRole('button', { name: 'Freeze' })
      .first();
    const unfreezeButton = initiator
      .getByTestId('investorsCard')
      .getByRole('button', { name: 'Unfreeze' });

    await expect(freezeButton).toBeDisabled();
    await expect(unfreezeButton).toBeDisabled();

    await initiator
      .locator('div[data-testid="investorTable"][data-isloading="false"]')
      .waitFor({ timeout: 60000 });

    const tableTds = await initiator
      .getByTestId('investorTable')
      .locator('table > tbody tr:has(td:nth-child(1))')
      .all();

    const promises1 = tableTds.map(async (td) => {
      await td.getByRole('checkbox').click();
      await initiator.waitForTimeout(200);
      const trigger = td.getByTestId('freezeAccountTrigger');
      await expect(trigger.locator('[data-frozenState="false"]')).toBeVisible();
    });

    await Promise.all(promises1);
    await initiator.waitForTimeout(500);

    await expect(freezeButton).toBeEnabled();
    await expect(unfreezeButton).toBeEnabled();

    await freezeButton.click();

    await initiator
      .getByRole('heading', { name: 'Freeze selected accounts' })
      .waitFor();
    await initiator.fill('[name="message"]', FROZENMESSAGE);

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      freezeButton,
      chainweaverApp.signWithPassword(
        initiator,
        initiator.getByRole('button', { name: 'Freeze' }),
      ),
    );

    // check the other screeens if they see the warning
    const promises = tableTds.map(async (td) => {
      const trigger = td.getByTestId('freezeAccountTrigger');
      await expect(trigger.locator('[data-frozenState="true"]')).toBeVisible();
    });
    await Promise.all(promises);

    await investor1.reload();
    await investor1.getByRole('heading', { name: FROZENMESSAGE }).waitFor();
    await expect(
      investor1.getByRole('heading', { name: FROZENMESSAGE }),
    ).toBeVisible();

    await investor2.reload();
    await investor2.getByRole('heading', { name: FROZENMESSAGE }).waitFor();
    await expect(
      investor2.getByRole('heading', { name: FROZENMESSAGE }),
    ).toBeVisible();

    // unfreeze the accounts
    const promises2 = tableTds.map(async (td) => {
      await td.getByRole('checkbox').click();
      await initiator.waitForTimeout(200);
    });
    await Promise.all(promises2);

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      unfreezeButton,
      chainweaverApp.signWithPassword(initiator, unfreezeButton),
    );

    const promises3 = tableTds.map(async (td, idx) => {
      const trigger = td.getByTestId('freezeAccountTrigger');
      await expect(trigger.locator('[data-frozenState="false"]')).toBeVisible();
    });
    await Promise.all(promises3);

    await expect(freezeButton).toBeDisabled();
    await expect(unfreezeButton).toBeDisabled();
  });

  await test.step('Distribute tokens', async () => {
    await initiator.goto('/investors');
    await RWADemoApp.selectInvestor(initiator, 0);

    const balanceInfo = initiator.getByTestId('balance-info');
    const balance = await RWADemoApp.getBalance(balanceInfo);

    await expect(balance).toBe('0');

    const button = initiator.getByTestId('action-distributetokens');
    await button.waitFor();
    await button.click();

    const rightAside = initiator.getByTestId('rightaside');

    await rightAside.locator('[name="amount"]').fill('20');

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      button,
      chainweaverApp.signWithPassword(
        initiator,
        rightAside.getByRole('button', { name: 'Distribute' }),
      ),
    );

    const newBalance = await RWADemoApp.getBalance(balanceInfo);
    await expect(newBalance).toBe('20');
  });
});
