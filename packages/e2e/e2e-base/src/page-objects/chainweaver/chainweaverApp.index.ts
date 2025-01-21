import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { WebAuthNHelper } from '../../helpers/chainweaver/webauthn.helper';

export class ChainweaverAppIndex {
  private _webAuthNHelper: WebAuthNHelper = new WebAuthNHelper();
  private _PROFILENAME: string = 'He-man';

  public constructor() {}

  public async createProfile(actor: Page): Promise<boolean> {
    await this._webAuthNHelper.enableVirtualAuthenticator(actor);

    const button = actor.getByText('Add new profile');
    await expect(button).toBeVisible();
    await button.click();

    const passwordlessButton = actor.getByRole('button', {
      name: 'Password-less',
    });
    await expect(passwordlessButton).toBeVisible();
    await actor.fill('#profileName', this._PROFILENAME);
    await passwordlessButton.click();

    const skipButton = actor.getByRole('button', {
      name: 'Skip',
    });
    await expect(skipButton).toBeVisible();
    await skipButton.click();

    return true;
  }

  public async logout(actor: Page): Promise<boolean> {
    const profileButton = actor.getByRole('button', {
      name: this._PROFILENAME,
    });
    await expect(profileButton).toHaveAttribute('aria-haspopup');
    await profileButton.click();

    const logoutButton = actor.getByRole('button', {
      name: 'Logout',
    });
    await logoutButton.click();

    return true;
  }
  public async selectProfile(
    actor: Page,
    profileName: string,
  ): Promise<boolean> {
    const button = actor.getByText(profileName);
    await expect(button).toBeVisible();
    await button.click();

    return true;
  }
}
