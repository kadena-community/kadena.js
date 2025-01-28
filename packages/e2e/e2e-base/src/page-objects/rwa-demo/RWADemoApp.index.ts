import type { Page } from '@playwright/test';
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

  public async login(actor: Page): Promise<boolean> {
    const authenticator =
      await this._webAuthNHelper.enableVirtualAuthenticator(actor);

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

    const credentials = await this._webAuthNHelper.getCredential(
      authenticator.authenticatorId,
      authenticator.cdpSession,
    );

    console.log(33333, credentials.credentials);
    expect(false).toBe(true);

    await expect(
      actor.getByRole('heading', {
        name: 'Add an asset',
      }),
    ).toBeVisible();

    return true;
  }
}
