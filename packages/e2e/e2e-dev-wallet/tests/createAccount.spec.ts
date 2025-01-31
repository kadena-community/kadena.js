import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test('Create account', async ({ initiator, chainweaverApp }) => {
  await test.step('setup', async () => {
    await initiator.goto('/')
    await chainweaverApp.setup(initiator);
  });

  await test.step('create account', async () => {
    await initiator.goto('/');
    await chainweaverApp.selectNetwork(initiator, 'Development');

    const result = await chainweaverApp.createAccount(initiator);

    expect(result).toEqual(true);
  });
});
