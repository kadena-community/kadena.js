import { expect } from '@playwright/test';
import { test } from '../fixtures/wallet.fixture';

test('Create account', async ({ initiator, chainweaverApp }) => {
  await test.step('setup', async () => {
    await initiator.goto('/');
    await chainweaverApp.removeSetupProps('initiator');
    await chainweaverApp.setup(initiator, 'initiator');
    await initiator.waitForTimeout(1000);
    await chainweaverApp.selectProfile(initiator, 'Skeletor');
  });

  await test.step('create account', async () => {
    await initiator.goto('/');
    await chainweaverApp.selectNetwork(initiator, 'development');
    const result = await chainweaverApp.createAccount(initiator);

    expect(result).toBeDefined();
  });
});
