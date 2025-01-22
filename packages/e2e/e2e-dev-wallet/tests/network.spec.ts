import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test('Network creation', async ({ initiator, chainweaverApp }) => {
  await test.step('Select network', async () => {
    await initiator.goto('/');
    await chainweaverApp.createProfile(initiator);
    await chainweaverApp.goToSettings(initiator);

    await expect(initiator.getByText('mainnet01 - Mainnet')).toBeVisible();
    await expect(initiator.getByText('development - Development')).toBeHidden();

    await chainweaverApp.addNetwork(initiator, {
      networkId: 'development',
      title: 'development',
      host: 'http://localhost:8080',
    });
  });
});
