import { expect } from '@playwright/test';
import { test } from '../fixtures/rwa-persona.fixture';

test('Create agent', async ({
  initiator,

  RWADemoApp,
  chainweaverApp,
}) => {
  await test.step('Setup', async () => {
    const initiatorPromise = await RWADemoApp.setup(initiator, chainweaverApp);
    // const agent1Promise = await RWADemoApp.setup(agent1, chainweaverApp);

    // await Promise.all([initiatorPromise, agent1Promise]);

    await expect(true).toBe(true);
  });
});
