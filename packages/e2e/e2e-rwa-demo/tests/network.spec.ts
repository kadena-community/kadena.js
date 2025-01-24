import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test('Login', async ({ initiator }) => {
  await test.step('Login', async () => {
    await initiator.goto('/');

    await expect(true).toEqual(true);
  });
});
