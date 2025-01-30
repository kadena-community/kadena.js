import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { WebAuthNHelper } from '../../helpers/chainweaver/webauthn.helper';

export class ChainweaverAppIndex {
  private _webAuthNHelper: WebAuthNHelper = new WebAuthNHelper();
  private _PROFILENAME: string = 'He-man';
  private _PROFILENAME_WITHPASSWORD: string = 'Skeletor';
  private _PASSWORD: string = 'M4st3r_of_th3_un1v3rs3';

  public constructor() {}

  public async createAccount(actor: Page): Promise<boolean> {
    const listItems = await actor
      .getByTestId('assetList')
      .getByRole('listitem')
      .all();
    await expect(listItems.length).toEqual(0);

    const newAccountButton = actor.getByRole('button', {
      name: 'Next Account',
    });
    await expect(newAccountButton).toBeVisible();
    await newAccountButton.click();

    const unlockButton = actor.getByRole('button', {
      name: 'Unlock',
    });

    await expect(unlockButton).toBeVisible();
    const input = actor.getByTestId('passwordField');
    await input.fill(this._PASSWORD);

    await unlockButton.click();
    await expect(unlockButton).toBeHidden();

    const newListItems = await actor
      .getByTestId('assetList')
      .getByRole('listitem')
      .all();

    await expect(newListItems.length).toEqual(1);
    return true;
  }

  public async setup(actor: Page, full: boolean = true): Promise<boolean> {
    await actor.goto('/');
    await this.createProfileWithPassword(actor);
    await this.goToSettings(actor);

    if (full) {
      await this.addNetwork(actor, {
        networkId: 'development',
        title: 'development',
        host: 'http://localhost:8080',
      });

      await this.selectNetwork(actor, 'Development');
    }
    return true;
  }
  public async createProfile(actor: Page): Promise<string> {
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

    return this._PROFILENAME;
  }
  public async createProfileWithPassword(actor: Page): Promise<string> {
    const button = actor.getByText('Add new profile');
    await expect(button).toBeVisible();
    await button.click();

    const passwordButton = actor.getByRole('button', {
      name: 'Prefer password',
    });
    await expect(passwordButton).toBeVisible();
    await actor.fill('#profileName', this._PROFILENAME_WITHPASSWORD);
    await passwordButton.click();

    //create password
    await expect(
      actor.getByRole('heading', {
        name: 'Choose a password',
      }),
    ).toBeVisible();

    const continueButton = actor.getByRole('button', {
      name: 'Continue',
    });
    await expect(continueButton).toBeDisabled();

    await actor.fill('#password', this._PASSWORD);
    await actor.fill('#confirmation', this._PASSWORD);

    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    const skipButton = actor.getByRole('button', {
      name: 'Skip',
    });
    await expect(skipButton).toBeVisible();
    await skipButton.click();

    return this._PROFILENAME_WITHPASSWORD;
  }

  public async logout(actor: Page, profileName: string): Promise<boolean> {
    const profileButton = actor.getByRole('button', {
      name: profileName,
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
