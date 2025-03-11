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

    await investor1.reload();
    await investor2.reload();
  });

  await test.step('Distribute tokens', async () => {
    await initiator.goto('/investors');
    await RWADemoApp.selectInvestor(initiator, 0);
    await initiator.waitForTimeout(1000);
    const balanceInfo = initiator.getByTestId('balance-info').first();
    await balanceInfo.waitFor();
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

    await initiator.waitForTimeout(1000);
    const newBalance = await RWADemoApp.getBalance(balanceInfo);
    await expect(newBalance).toBe('20');

    //check that investor1 now has balance of 20
    const investor1Balance = investor1.getByTestId('balance').first();
    const newBalanceInvestor1 = await RWADemoApp.getBalance(investor1Balance);
    await expect(newBalanceInvestor1).toBe('20');

    //check that investor2 now has balance of 0
    const investor2Balance = investor2.getByTestId('balance').first();
    const newBalanceInvestor2 = await RWADemoApp.getBalance(investor2Balance);
    await expect(newBalanceInvestor2).toBe('0');
  });

  await test.step('Transfer tokens', async () => {
    await RWADemoApp.addSimpleKDA(investor1, chainweaverApp);

    const transferAction = investor1.getByTestId('transferassetAction');
    const rightaside = investor1.getByTestId('rightaside');
    const transferButton = rightaside.getByRole('button', { name: 'Transfer' });
    const descriptionString = rightaside.getByText('max amount tokens');
    await transferAction.click();

    await expect(transferButton).toBeDisabled();
    const txt = await descriptionString.allTextContents();
    await expect(txt[0]).toContain('20');

    await rightaside.locator('[name="amount"]').fill('15');

    await rightaside.getByRole('button', { name: 'Select an option' }).click();
    await investor1.getByRole('listbox').locator('li').first().click();

    await expect(transferButton).toBeEnabled();

    await RWADemoApp.checkLoadingIndicator(
      investor1,
      transferAction,
      chainweaverApp.signWithPassword(investor1, transferButton),
    );

    await investor1.waitForTimeout(1000);

    //check that investor1 now has balance of 5
    const investor1Balance = investor1.getByTestId('balance').first();
    const newBalanceInvestor1 = await RWADemoApp.getBalance(investor1Balance);
    await expect(newBalanceInvestor1).toBe('5');

    //check that investor2 now has balance of 15
    const investor2Balance = investor2.getByTestId('balance').first();
    const newBalanceInvestor2 = await RWADemoApp.getBalance(investor2Balance);
    await expect(newBalanceInvestor2).toBe('15');
  });

  await test.step('When contract frozen, investor not allowed to transfer tokens', async () => {
    await initiator.goto('/');
    await investor1.goto('/');

    //the investor transferbutton is enabled
    const transferassetAction = investor1.getByTestId('transferassetAction');
    await expect(transferassetAction).not.toHaveAttribute('data-disabled');

    const pauseAction = initiator.getByTestId('pauseAction');
    await pauseAction.waitFor();
    await pauseAction.scrollIntoViewIfNeeded();

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      pauseAction,
      chainweaverApp.signWithPassword(initiator, pauseAction),
    );

    await initiator.waitForTimeout(1000);

    const transferassetActionNew = investor2.getByTestId('transferassetAction');
    await transferassetActionNew.scrollIntoViewIfNeeded();
    await expect(transferassetActionNew).toHaveAttribute(
      'data-disabled',
      'true',
    );

    const pauseActionNext = initiator.getByTestId('pauseAction');
    await pauseActionNext.waitFor();
    await pauseActionNext.scrollIntoViewIfNeeded();

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      pauseActionNext,
      chainweaverApp.signWithPassword(initiator, pauseActionNext),
    );

    await initiator.waitForTimeout(1000);

    const transferassetActionNew2 = investor2.getByTestId(
      'transferassetAction',
    );
    await expect(transferassetActionNew2).not.toHaveAttribute('data-disabled');
  });

  await test.step('When investor is pauzed, investor not allowed to transfer tokens', async () => {
    await initiator.goto('/investors');
    await investor1.goto('/');
    await investor2.goto('/');

    //the investor transferbutton is enabled
    const transferassetAction = investor1.getByTestId('transferassetAction');
    const transferassetActionInvestor2 = investor2.getByTestId(
      'transferassetAction',
    );
    await expect(transferassetAction).not.toHaveAttribute('data-disabled');
    await expect(transferassetActionInvestor2).not.toHaveAttribute(
      'data-disabled',
    );

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
    await expect(trigger.locator('[data-frozenState="false"]')).toBeVisible();
    await trigger.click();

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      trigger,
      chainweaverApp.signWithPassword(
        initiator,
        initiator.getByRole('button', { name: 'Freeze' }).nth(0),
      ),
    );

    await expect(trigger.locator('[data-frozenState="true"]')).toBeVisible();
    await expect(transferassetAction).toHaveAttribute('data-disabled', 'true');
    await expect(transferassetActionInvestor2).not.toHaveAttribute(
      'data-disabled',
    );

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      trigger,
      chainweaverApp.signWithPassword(initiator, trigger),
    );
    await expect(transferassetAction).not.toHaveAttribute('data-disabled');
    await expect(transferassetActionInvestor2).not.toHaveAttribute(
      'data-disabled',
    );
  });
});
