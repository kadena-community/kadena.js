import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test('Create account', async ({ initiator, chainweaverApp }) => {
  await test.step('setup', async () => {
    await chainweaverApp.setup(initiator, false);
  });

  await test.step('create account', async () => {
    await initiator.goto('/');

    const result = await chainweaverApp.createAccount(initiator);

    expect(result).toEqual(true);
  });
});
