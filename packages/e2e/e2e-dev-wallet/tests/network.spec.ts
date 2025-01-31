import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test('Network creation', async ({ initiator, chainweaverApp }) => {
  await test.step('setup', async () => {
    await initiator.goto('/')
    await chainweaverApp.setup(initiator, false);
  });
  await test.step('Create network', async () => {
    await initiator.goto('/networks');
    await expect(initiator.getByText('mainnet01 - Mainnet')).toBeVisible();
    await expect(initiator.getByText('development - development')).toBeHidden();

    await chainweaverApp.addNetwork(initiator, {
      networkId: 'development',
      title: 'development',
      host: 'http://localhost:8080',
    });

    await expect(
      initiator.getByText('development - development'),
    ).toBeVisible();
  });

  await test.step('Select network', async () => {
    await initiator.goto('/');
    await expect(initiator.getByTestId('networkselector').first()).toHaveText(
      'Mainnet',
    );
    await expect(initiator.getByTestId('breadcrumbs')).toHaveText(/Mainnet*/);
    await chainweaverApp.selectNetwork(initiator, 'development');

    await expect(initiator.getByTestId('networkselector').first()).toHaveText(
      'development',
    );
    await expect(initiator.getByTestId('breadcrumbs')).toHaveText(
      /development*/,
    );
  });
});
