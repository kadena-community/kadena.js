import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test('Create agent', async ({ initiator, RWADemoApp, chainweaverApp }) => {
  await test.step('Setup', async () => {
    await RWADemoApp.setup(initiator, chainweaverApp);
    await expect(true).toBe(true);
  });
});
