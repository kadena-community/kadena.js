import { expect } from '@playwright/test';
import { test } from '../fixtures/rwa-persona.fixture';

test('Create agent', async ({
  initiator,
  agent1,
  RWADemoApp,
  chainweaverApp,
}) => {
  await test.step('Setup', async () => {
    const initiatorPromise = RWADemoApp.setup(initiator, chainweaverApp);
    const agent1Promise = RWADemoApp.setup(agent1, chainweaverApp);
    await Promise.all([initiatorPromise, agent1Promise]);
  });

  await test.step('give agent the link to the asset of the initiator', async () => {
    await initiator
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
    await agent1
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);

    const initiatorNamespace = await initiator
      .getByTestId('contractCard')
      .getByTestId('namespace')
      .locator('span')
      .innerText();
    const agent1Namespace = await agent1
      .getByTestId('contractCard')
      .getByTestId('namespace')
      .locator('span')
      .innerText();

    await expect(initiatorNamespace !== agent1Namespace).toBe(true);
    const link = await RWADemoApp.getAssetLink(initiator);

    await agent1.goto(link);
    await agent1.waitForTimeout(200);

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

    await expect(initiatorNamespaceNew !== agent1NamespaceNew).toBe(false);
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
    await initiator.getByTestId('leftaside').locator('li:nth-child(2)').click();
    await expect(
      initiator
        .getByTestId('agentsCard')
        .getByRole('heading', { name: 'Agents' }),
    ).toBeVisible();
  });

  await test.step('Add Agent1 as Agent', async () => {
    await expect(initiator.getByTestId('agentTable')).toHaveAttribute(
      'data-isloading',
      'true',
    );

    await initiator.waitForTimeout(10000);
    await expect(initiator.getByTestId('agentTable')).toHaveAttribute(
      'data-isloading',
      'false',
    );
    const t = await initiator.locator('table > tbody tr').all();
    console.log(t);
  });
});
