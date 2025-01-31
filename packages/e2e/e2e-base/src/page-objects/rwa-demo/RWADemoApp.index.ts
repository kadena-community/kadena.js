import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { WebAuthNHelper } from '../../helpers/chainweaver/webauthn.helper';

export class RWADemoAppIndex {
  private _webAuthNHelper: WebAuthNHelper = new WebAuthNHelper();
  private _PROFILENAME: string = 'He-man';
  public constructor() {}

  public async cookieConsent(actor: Page): Promise<boolean> {
    await expect(
      actor.getByRole('heading', {
        name: 'Cookie Consent',
      }),
    ).toBeVisible();

    const cookieConsentValue = await actor.evaluate(() =>
      localStorage.getItem('cookie_consent'),
    );

    expect(cookieConsentValue).toEqual(null);
    const button = actor.getByRole('button', {
      name: 'Accept',
    });
    await button.click();

    await expect(
      actor.getByRole('heading', {
        name: 'Cookie Consent',
      }),
    ).toBeHidden();

    const cookieConsentValueNew = await actor.evaluate(() =>
      localStorage.getItem('cookie_consent'),
    );
    expect(cookieConsentValueNew).toEqual('true');

    return true;
  }

  public async checkLoadingIndicator(
    actor: Page,
    loadingWrapper: Locator,
    callback: Promise<any>,
  ): Promise<void> {
    await expect(
      loadingWrapper.getByTestId('no-pending-transactionIcon'),
    ).toBeVisible();
    await expect(
      loadingWrapper.getByTestId('pending-transactionIcon'),
    ).toBeHidden();

    await callback;

    //show loading indicator
    await expect(
      loadingWrapper.getByTestId('no-pending-transactionIcon'),
    ).toBeHidden();
    await expect(
      loadingWrapper.getByTestId('pending-transactionIcon'),
    ).toBeVisible();

    await actor.waitForTimeout(3000);

    if (await loadingWrapper.isVisible()) {
      await expect(
        loadingWrapper.getByTestId('no-pending-transactionIcon'),
      ).toBeVisible();
      await expect(
        loadingWrapper.getByTestId('pending-transactionIcon'),
      ).toBeHidden();
    }
  }

  public async login(actor: Page): Promise<boolean> {
    await expect(
      actor.getByRole('heading', {
        name: 'Login',
      }),
    ).toBeVisible();

    const popupPromise = actor.waitForEvent('popup');
    const button = actor.getByRole('button', {
      name: 'Connect',
    });
    await button.click();
    const walletPopup = await popupPromise;

    const loginAcceptButton = walletPopup.getByRole('button', {
      name: 'Accept',
    });

    await expect(loginAcceptButton).toBeVisible();
    await loginAcceptButton.click();

    await expect(
      actor.getByRole('heading', {
        name: 'Add an asset',
      }),
    ).toBeVisible();

    return true;
  }
}
