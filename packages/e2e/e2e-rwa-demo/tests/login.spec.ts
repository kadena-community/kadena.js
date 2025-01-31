import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

test('Create first asset', async ({
  initiator,
  RWADemoApp,
  chainweaverApp,
}) => {
  await test.step('Setup wallet', async () => {
    await initiator.goto('https://wallet.kadena.io');
    await chainweaverApp.createProfileWithPassword(initiator);
    await chainweaverApp.goToSettings(initiator);

    await expect(initiator.getByText('mainnet01 - Mainnet')).toBeVisible();
    await expect(initiator.getByText('development - development')).toBeHidden();

    await chainweaverApp.addNetwork(initiator, {
      networkId: 'development',
      title: 'development',
      host: 'http://localhost:8080',
    });
    await chainweaverApp.selectNetwork(initiator, 'development');
    await initiator.goto('https://wallet.kadena.io/');
    await chainweaverApp.createAccount(initiator);
  });

  await test.step('remove cookie consent window', async () => {
    await initiator.goto('/');

    await RWADemoApp.cookieConsent(initiator);
    await expect(true).toEqual(true);
  });

  await test.step('Login', async () => {
    //setup profile and account in the wallet
    await initiator.goto('/');

    const result = await RWADemoApp.login(initiator);
    await expect(result).toEqual(true);
  });

  await test.step('Add Kadena for gas', async () => {
    //setup profile and account in the wallet
    await initiator.goto('/');

    await expect(
      initiator.getByRole('heading', {
        name: 'Add an asset',
      }),
    ).toBeVisible();

    await expect(
      initiator.getByRole('heading', {
        name: 'The account has no balance to pay the gas',
      }),
    ).toBeVisible();

    const addButton = initiator.getByRole('button', {
      name: 'Add 5 KDA for Gas',
    });

    const startNewAssetButton = initiator.getByRole('button', {
      name: 'Start new Asset',
    });
    await expect(startNewAssetButton).toBeDisabled();

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      addButton,
      chainweaverApp.signWithPassword(initiator, addButton),
    );

    await expect(startNewAssetButton).toBeEnabled();
  });

  await test.step('Create new asset', async () => {
    await initiator
      .getByRole('button', {
        name: 'Start new Asset',
      })
      .click();

    const createContractButton = initiator.getByRole('button', {
      name: 'Create the contract',
    });

    await expect(createContractButton).toBeDisabled();

    const namespace = await initiator
      .getByTestId('namespaceField')
      .inputValue();
    await expect(namespace.startsWith('n_')).toEqual(true);
    await initiator.fill('#contractName', 'He-man');

    await expect(createContractButton).toBeEnabled();

    await RWADemoApp.checkLoadingIndicator(
      initiator,
      createContractButton,
      chainweaverApp.signWithPassword(initiator, createContractButton),
    );
  });
});
