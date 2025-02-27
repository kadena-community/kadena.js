import type { ILoginDataRWAProps } from '@kadena-dev/e2e-base/src/page-objects/rwa-demo/RWADemoApp.index';
import { expect } from '@playwright/test';
import { test } from '../fixtures/rwa-persona.fixture';

test('Compliance MaxSupply', async ({
  initiator,
  RWADemoApp,
  chainweaverApp,
}) => {
  let ownerProps: ILoginDataRWAProps;

  await test.step('setup the 2 accounts in the same contract', async () => {
    await RWADemoApp.setup(initiator, chainweaverApp, 'initiator');

    ownerProps = await RWADemoApp.setupAppend(
      initiator,
      chainweaverApp,
      'initiator',
    );

    await RWADemoApp.createInvestor(
      initiator,
      ownerProps,
      'Skeletor',
      chainweaverApp,
    );
    await initiator.reload();

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
      fill: 100,
      endBalance: 100,
    });
  });

  await test.step('Distribute tokens with compliance rule active, but no value', async () => {
    await initiator.goto(`/`);

    const complianceRule = initiator.getByTestId('compliance-maxSupply');
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
      startBalance: 100,
      fill: 100,
      endBalance: 200,
    });
  });

  await test.step('Activate the maxSupply rule with a value, should return a warning when max value is exceeded', async () => {
    await initiator.goto(`/`);

    const editBtn = initiator.getByTestId('editrules');
    await editBtn.waitFor();
    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.click();

    const complianceRule = initiator.getByTestId('compliance-maxSupply');
    await complianceRule.waitFor();
    await complianceRule.scrollIntoViewIfNeeded();
    const complianceRuleText = complianceRule.getByTestId('compliance-text');
    const complianceRuleBtn = complianceRule.getByRole('button');

    expect(await complianceRuleText.allTextContents()).toContain(
      'no limit tokens',
    );

    const rightAside = initiator.getByTestId('rightaside');
    await rightAside.locator('[name="maxSupply"]').fill('100');

    const setComplianceBtn = rightAside.getByRole('button', {
      name: 'Set Compliance',
    });

    await initiator.waitForTimeout(1000);

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      complianceRuleBtn,
      chainweaverApp.signWithPassword(initiator, setComplianceBtn),
    );

    expect(await complianceRuleText.allTextContents()).toContain('100 tokens');

    // check the total token supply
    const tokenSupply = initiator.getByTestId('tokenSupply');
    await tokenSupply.waitFor();
    await tokenSupply.scrollIntoViewIfNeeded();
    expect(await tokenSupply.locator('span span').allTextContents()).toContain(
      '200',
    );

    expect(
      await tokenSupply.locator('span svg title').allTextContents(),
    ).toContain(
      'The total supply of tokens is bigger than the max supply (100)',
    );
  });

  await test.step('Activate the maxSupply rule with a value, should have a max of supply to be distributed', async () => {
    await initiator.goto(`/`);

    const editBtn = initiator.getByTestId('editrules');
    await editBtn.waitFor();
    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.click();

    const complianceRule = initiator.getByTestId('compliance-maxSupply');
    const complianceRuleText = complianceRule.getByTestId('compliance-text');

    const rightAside = initiator.getByTestId('rightaside');
    await rightAside.locator('[name="maxSupply"]').fill('500');

    const setComplianceBtn = rightAside.getByRole('button', {
      name: 'Set Compliance',
    });

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      complianceRuleText,
      chainweaverApp.signWithPassword(initiator, setComplianceBtn),
    );

    expect(await complianceRuleText.allTextContents()).toContain('500 tokens');

    // check that the investor now has a max that can be distributed
    await initiator.goto(
      `/investors/${ownerProps.data.data.account[0].value.address}`,
    );

    const distributetokensBtn = initiator.getByTestId(
      'action-distributetokens',
    );
    await distributetokensBtn.waitFor();
    await distributetokensBtn.click();

    const distributeButton = rightAside.getByRole('button', {
      name: 'Distribute',
    });
    const descriptionString = rightAside.getByText('max amount');

    await rightAside.locator('[name="amount"]').fill('1');
    await expect(distributeButton).toBeEnabled();
    const txt = await descriptionString.allTextContents();
    await expect(txt[0]).toContain('300');

    await rightAside.locator('[name="amount"]').fill('400');
    await expect(distributeButton).toBeDisabled();
  });
});
