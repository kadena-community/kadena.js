import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import type { ILoginDataRWAProps } from '@kadena-dev/e2e-base/src/page-objects/rwa-demo/RWADemoApp.index';
import { expect } from '@playwright/test';

let DATA: ILoginDataRWAProps['assetContract'];

test('Create first asset', async ({
  initiator,
  RWADemoApp,
  chainweaverApp,
}) => {
  await test.step('Setup wallet', async () => {
    await chainweaverApp.removeSetupProps('initiator');
    await RWADemoApp.setup(initiator, chainweaverApp, 'initiator');
  });

  await test.step('remove cookie consent window', async () => {
    await initiator.goto('/');

    await RWADemoApp.cookieConsent(initiator);
    await expect(true).toEqual(true);
  });

  await test.step('Add Kadena for gas', async () => {
    //setup profile and account in the wallet
    await initiator.goto('/');

    await RWADemoApp.addKDA(initiator, chainweaverApp);
  });

  await test.step('Create new asset', async () => {
    DATA = await RWADemoApp.createAsset(initiator, chainweaverApp);
  });

  await test.step('Check dashboard setup for the owner', async () => {
    await expect(
      initiator.getByRole('heading', { name: DATA?.contractName ?? '' }),
    ).toBeVisible();

    //check the contractcard
    const contractCard = initiator.getByTestId('contractCard');
    await expect(
      contractCard.getByTestId('contractName').locator('span'),
    ).toHaveText(DATA?.contractName ?? '');
    await expect(
      contractCard.getByTestId('namespace').locator('span'),
    ).toHaveText(DATA?.namespace ?? '');
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
