import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

const CONTRACTNAME = 'He-man';
let NAMESPACE = '';

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
    NAMESPACE = await RWADemoApp.createAsset(initiator, chainweaverApp);
  });

  await test.step('Check dashboard setup for the owner', async () => {
    await expect(
      initiator.getByRole('heading', { name: CONTRACTNAME }),
    ).toBeVisible();

    //check the contractcard
    const contractCard = initiator.getByTestId('contractCard');
    await expect(
      contractCard.getByTestId('contractName').locator('span'),
    ).toHaveText(CONTRACTNAME);
    await expect(
      contractCard.getByTestId('namespace').locator('span'),
    ).toHaveText(NAMESPACE);
    await await expect(
      contractCard.getByTestId('tokenSupply').locator('span'),
    ).toHaveText('0');
    await await expect(contractCard.getByTestId('balance')).toBeHidden();

    //check the assetcard persmissions
    const assetCard = initiator.getByTestId('assetCard');
    await expect(assetCard.getByTestId('pauseAction')).toHaveAttribute(
      'data-disabled',
      'true',
    );
    await expect(assetCard.getByTestId('complianceAction')).not.toHaveAttribute(
      'data-disabled',
    );
    await expect(assetCard.getByTestId('transferassetAction')).toHaveAttribute(
      'data-disabled',
      'true',
    );
    await expect(assetCard.getByTestId('batchTransferAction')).toHaveAttribute(
      'data-disabled',
      'true',
    );

    //check the compliancecard persmissions
    const complianceCard = initiator.getByTestId('complianceCard');
    await complianceCard.scrollIntoViewIfNeeded();
    await expect(complianceCard.getByTestId('editrules')).toBeEnabled();
  });
});
