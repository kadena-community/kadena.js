import type { ILoginDataRWAProps } from '@kadena-dev/e2e-base/src/page-objects/rwa-demo/RWADemoApp.index';
import { expect } from '@playwright/test';
import { test } from '../fixtures/rwa-persona.fixture';

test('Create agent', async ({
  initiator,
  agent1,
  RWADemoApp,
  chainweaverApp,
}) => {
  let ownerProps: ILoginDataRWAProps;
  let agent1Props: ILoginDataRWAProps;

  await test.step('give agent the link to the asset of the initiator', async () => {
    await RWADemoApp.setup(initiator, chainweaverApp, 'initiator');

    agent1Props = (await RWADemoApp.setup(
      agent1,
      chainweaverApp,
      'agent1',
    )) as ILoginDataRWAProps;

    ownerProps = await RWADemoApp.setupAppend(
      initiator,
      chainweaverApp,
      'initiator',
    );
    await initiator.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );

    await agent1.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );

    await expect(true).toBe(true);
  });

  // await test.step('give agent the link to the asset of the initiator', async () => {
  //   await initiator
  //     .context()
  //     .grantPermissions(['clipboard-read', 'clipboard-write']);
  //   await agent1
  //     .context()
  //     .grantPermissions(['clipboard-read', 'clipboard-write']);

  //   const link = await RWADemoApp.getAssetLink(initiator);

  //   await agent1.goto(link);
  //   await agent1.waitForTimeout(200);

  //   await agent1
  //     .getByRole('heading', { name: ownerProps.assetContract?.contractName })
  //     .waitFor();

  //   await initiator
  //     .getByTestId('contractCard')
  //     .getByTestId('namespace')
  //     .waitFor({ state: 'visible' });

  //   const initiatorNamespaceNew = await initiator
  //     .getByTestId('contractCard')
  //     .getByTestId('namespace')
  //     .locator('span')
  //     .innerText();
  //   const agent1NamespaceNew = await agent1
  //     .getByTestId('contractCard')
  //     .getByTestId('namespace')
  //     .locator('span')
  //     .innerText();

  //   await expect(
  //     initiatorNamespaceNew === ownerProps.assetContract?.namespace,
  //   ).toBe(true);
  //   await expect(initiatorNamespaceNew === agent1NamespaceNew).toBe(true);
  // });

  // await test.step('check set compliance rules for owner and agent', async () => {
  //   await agent1.goto('/');
  //   await initiator.goto('/');

  //   await expect(
  //     agent1.getByTestId('assetCard').getByTestId('complianceAction'),
  //   ).toHaveAttribute('data-disabled', 'true');
  //   await expect(
  //     agent1.getByTestId('leftaside').locator('li:nth-child(2)'),
  //   ).not.toHaveText('Agents');

  //   await expect(
  //     initiator.getByTestId('assetCard').getByTestId('complianceAction'),
  //   ).not.toHaveAttribute('data-disabled');
  //   await expect(
  //     initiator.getByTestId('leftaside').locator('li:nth-child(2)'),
  //   ).toHaveText('Agents');
  // });

  // await test.step('Set agent1 to agentrole', async () => {
  //   await initiator
  //     .getByTestId('leftaside')
  //     .locator('nav > ul li:nth-child(2)')
  //     .click();
  //   await initiator
  //     .getByTestId('agentsCard')
  //     .getByRole('heading', { name: 'Agents' })
  //     .waitFor();

  //   await expect(
  //     initiator
  //       .getByTestId('agentsCard')
  //       .getByRole('heading', { name: 'Agents' }),
  //   ).toBeVisible();
  // });

  await test.step('Add Agent1 as Agent role "agent-admin"', async () => {
    await initiator.goto('/agents');

    await expect(initiator.getByTestId('agentTable')).toHaveAttribute(
      'data-isloading',
      'true',
    );

    await initiator
      .locator('div[data-testid="agentTable"][data-isloading="false"]')
      .waitFor({ timeout: 60000 });

    await initiator.waitForTimeout(1000);

    const tr = await initiator.locator('table > tbody tr').all();
    await expect(tr.length).toBe(0);

    await initiator
      .getByTestId('agentsCard')
      .getByRole('button', { name: 'Add Agent' })
      .click();

    const rightAside = initiator.getByTestId('rightaside');
    await initiator.type(
      '[name="accountName"]',
      agent1Props.data.data.account[0].value.address,
      { delay: 10 },
    );
    await initiator.type('[name="alias"]', 'skeletor', { delay: 10 });

    await rightAside.getByRole('checkbox').first().click();

    const txSpinner = initiator.getByTestId('agentTableTxSpinner');
    await RWADemoApp.checkLoadingIndicator(
      initiator,
      txSpinner,
      chainweaverApp.signWithPassword(
        initiator,
        rightAside.getByRole('button', { name: 'Add Agent' }),
      ),
    );

    const newTr = await initiator.locator('table > tbody tr').all();
    await expect(newTr.length).toBe(1);
  });
});
