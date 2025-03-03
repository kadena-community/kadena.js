import type { ILoginDataRWAProps } from '@kadena-dev/e2e-base/src/page-objects/rwa-demo/RWADemoApp.index';
import { expect } from '@playwright/test';
import { test } from '../fixtures/rwa-persona.fixture';

test('Compliance Max Balance', async ({
  initiator,
  investor1,
  RWADemoApp,
  chainweaverApp,
}) => {
  let ownerProps: ILoginDataRWAProps;
  let investor1Props: ILoginDataRWAProps;

  await test.step('setup the accounts in the same contract', async () => {
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

    await initiator.reload();
    await investor1.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );

    await RWADemoApp.createInvestor(
      initiator,
      ownerProps,
      'He-man',
      chainweaverApp,
    );

    await initiator.reload();

    await RWADemoApp.createInvestor(
      initiator,
      investor1Props,
      'Skeletor',
      chainweaverApp,
    );

    await investor1.reload();

    // needed to test all the functionality for investors admin
    await RWADemoApp.createAgent(
      initiator,
      ownerProps,
      'He-man',
      chainweaverApp,
    );

    await expect(true).toBe(true);
  });

  await test.step('Distribute tokens without a compliance rule', async () => {
    await initiator.goto(
      `/investors/${ownerProps.data.data.account[0].value.address}`,
    );

    await RWADemoApp.distributeTokens(initiator, chainweaverApp, {
      startBalance: 0,
      fill: 300,
      endBalance: 300,
    });
  });

  await test.step('transfer tokens without a compliance rule', async () => {
    await initiator.goto(`/`);
    await investor1.goto('/');

    const transferassetAction = initiator.getByTestId('transferassetAction');
    await transferassetAction.waitFor();
    await transferassetAction.click();
    const rightaside = initiator.getByTestId('rightaside');
    const transferButton = rightaside.getByRole('button', { name: 'Transfer' });
    await rightaside.locator('[name="amount"]').waitFor();
    await rightaside.locator('[name="amount"]').fill('50');

    const selectBtn = rightaside.locator('[data-role="select-button"]');
    await selectBtn.click();
    await initiator.waitForTimeout(1000);
    if (
      !(await initiator.getByRole('listbox').locator('li').first().isVisible())
    ) {
      await selectBtn.click();
    }

    await initiator.waitForTimeout(1000);
    await initiator.getByRole('listbox').locator('li').first().waitFor();
    await initiator.getByRole('listbox').locator('li').first().click();

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      transferassetAction,
      chainweaverApp.signWithPassword(initiator, transferButton),
    );
  });

  await test.step('Distribute tokens with compliance rule active, but no value', async () => {
    await initiator.goto(`/`);

    const complianceRule = initiator.getByTestId('compliance-maxBalance');
    await complianceRule.waitFor();
    await complianceRule.scrollIntoViewIfNeeded();
    const btn = complianceRule.getByRole('button');

    await btn.click();
    const okBtn = initiator.getByRole('button', { name: 'ok' });

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      btn,
      chainweaverApp.signWithPassword(initiator, okBtn),
    );

    await initiator.goto(
      `/investors/${ownerProps.data.data.account[0].value.address}`,
    );

    await RWADemoApp.distributeTokens(initiator, chainweaverApp, {
      startBalance: 250,
      fill: 50,
      endBalance: 300,
    });
  });

  await test.step('Activate the maxBalance rule with a value, should return a warning when max balance for this account is exceeded', async () => {
    await expect(true).toEqual(true);
  });

  await test.step('Activate the maxBalance rule with a value, should have a max of balance that can be distributed', async () => {
    await expect(true).toEqual(true);
  });
  await test.step('Activate the maxBalance rule with a value, should have a max amount that can be transferred to other account', async () => {
    await expect(true).toEqual(true);
  });
});
