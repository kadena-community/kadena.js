import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { WebAuthNHelper } from '@kadena-dev/e2e-base/src/helpers/chainweaver/webauthn.helper';
import { expect } from '@playwright/test';

const webAuthNHelper: WebAuthNHelper = new WebAuthNHelper();

test('Login', async ({ initiator, RWADemoApp, chainweaverApp }) => {
  await test.step('Setup wallet', async () => {
    await initiator.goto('https://wallet.kadena.io');
    await chainweaverApp.createProfile(initiator);
    await chainweaverApp.goToSettings(initiator);

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
    await webAuthNHelper.enableVirtualAuthenticator(initiator);

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

    const popupPromise = initiator.waitForEvent('popup');
    await addButton.click();

    const walletPopup = await popupPromise;
    await webAuthNHelper.enableVirtualAuthenticator(walletPopup);
    const signTxButton = walletPopup.getByRole('button', {
      name: 'Sign Tx',
    });
    await expect(signTxButton).toBeVisible();
    await signTxButton.click();

    const unlockButton = walletPopup.getByRole('button', {
      name: 'unlock',
    });

    await expect(unlockButton).toBeVisible();
    await unlockButton.click();
  });
});
