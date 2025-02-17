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

    await agent1.goto(
      `/assets/create/${ownerProps.assetContract?.namespace}/${ownerProps.assetContract?.contractName}`,
    );

    await expect(true).toBe(true);
  });

  await test.step('give agent the link to the asset of the initiator', async () => {
    await initiator
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
    await agent1
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);

    const link = await RWADemoApp.getAssetLink(initiator);

    await agent1.goto(link);
    await agent1.waitForTimeout(200);

    await agent1
      .getByRole('heading', { name: ownerProps.assetContract?.contractName })
      .waitFor();

    await initiator
      .getByTestId('contractCard')
      .getByTestId('namespace')
      .waitFor({ state: 'visible' });

    const initiatorNamespaceNew = await initiator
      .getByTestId('contractCard')
      .getByTestId('namespace')
      .locator('span')
      .innerText();
    const agent1NamespaceNew = await agent1
      .getByTestId('contractCard')
      .getByTestId('namespace')
      .locator('span')
      .innerText();

    await expect(
      initiatorNamespaceNew === ownerProps.assetContract?.namespace,
    ).toBe(true);
    await expect(initiatorNamespaceNew === agent1NamespaceNew).toBe(true);
  });

  await test.step('check set compliance rules for owner and agent', async () => {
    await agent1.goto('/');
    await initiator.goto('/');

    await expect(
      agent1.getByTestId('assetCard').getByTestId('complianceAction'),
    ).toHaveAttribute('data-disabled', 'true');
    await expect(
      agent1.getByTestId('leftaside').locator('li:nth-child(2)'),
    ).not.toHaveText('Agents');

    await expect(
      initiator.getByTestId('assetCard').getByTestId('complianceAction'),
    ).not.toHaveAttribute('data-disabled');
    await expect(
      initiator.getByTestId('leftaside').locator('li:nth-child(2)'),
    ).toHaveText('Agents');
  });

  await test.step('Set agent1 to agentrole', async () => {
    await initiator
      .getByTestId('leftaside')
      .locator('nav > ul li:nth-child(2)')
      .click();
    await initiator
      .getByTestId('agentsCard')
      .getByRole('heading', { name: 'Agents' })
      .waitFor();

    await expect(
      initiator
        .getByTestId('agentsCard')
        .getByRole('heading', { name: 'Agents' }),
    ).toBeVisible();
  });

  await test.step('Add Agent1 as Agent role "agent-admin"', async () => {
    await initiator.goto('/agents');

    await expect(initiator.getByTestId('agentTable')).toHaveAttribute(
      'data-isloading',
      'true',
    );

    await RWADemoApp.createAgent(
      initiator,
      agent1Props,
      'Orko',
      chainweaverApp,
    );
  });

  await test.step('when agent is removed, the roles should also be removed', async () => {
    /**
     * TODO: there is a bug where the roles for the call `get-agent-roles` are not removed once the agent is removed
     * the actual rights ARE removed, just not the roles definition
     * once this bug is fixed, lets create a test for it
     * https://app.asana.com/0/1208241270436006/1209168000490129
     * replicate:
     * 1. create new asset
     * 2. owner does not have role for freezing contract and can not freeze contract on dashboard
     * 3. add owner as an agent with freezer role
     * 4. owner now can freeze the contract on dashboard
     * 5. remove owner as an agent
     * 6. owner still has the role to freeze the contract on dashboard (still should NOT be the case)
     */
  });
});
