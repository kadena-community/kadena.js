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
  public async goToSettings(actor: Page): Promise<boolean> {
    await actor.getByRole('heading', { name: 'Your Assets' }).waitFor();
    await expect(
      actor.getByRole('heading', { name: 'Your Assets' }),
    ).toBeVisible();

    await actor.getByRole('button', { name: 'Mainnet' }).waitFor();
    await actor.getByRole('button', { name: 'Mainnet' }).click();
    await actor.getByRole('button', { name: 'Settings' }).waitFor();
    await actor.getByRole('button', { name: 'Settings' }).click();

    await expect(actor).toHaveURL('/networks');

    return true;
  }
  public async addNetwork(
    actor: Page,
    network: { networkId: string; title: string; host: string },
  ): Promise<boolean> {
    await expect(actor.getByTestId('rightaside')).not.toBeInViewport();
    await actor.getByRole('button', { name: 'Add Network' }).click();
    await expect(actor.getByTestId('rightaside')).toBeInViewport();
    const icon = actor.getByTestId('testnetworkicon');
    const saveButton = actor.getByRole('button', { name: 'Save' });

    await expect(icon).toHaveAttribute('data-ishealthy', 'undefined');
    await expect(saveButton).toHaveAttribute('disabled');

    await expect(icon).toBeVisible();
    await expect(
      actor.getByRole('heading', { name: 'Add Network' }),
    ).toBeVisible();
    await actor.type('[name="networkId"]', network.networkId);
    await actor.type('[name="hosts.0.url"]', network.host);
    await actor.type('[name="name"]', network.title);
    await actor.focus('[name="name"]');

    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute('data-ishealthy', 'true');

    await expect(saveButton).not.toHaveAttribute('disabled');
    await saveButton.click();

    await actor.waitForTimeout(500);
    await expect(actor.getByTestId('rightaside')).not.toBeInViewport();
    return true;
  }
  public async selectNetwork(actor: Page, network: string): Promise<boolean> {
    await actor.getByTestId('networkselector').first().click();
    await actor.getByRole('button', { name: network }).click();

    return true;
  }
}
