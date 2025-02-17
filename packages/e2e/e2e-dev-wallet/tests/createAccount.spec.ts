import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

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
