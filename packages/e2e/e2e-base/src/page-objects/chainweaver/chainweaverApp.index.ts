import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { WebAuthNHelper } from '../../helpers/chainweaver/webauthn.helper';
import type { ILoginDataProps } from './setupDatabase';
import { setupDatabase } from './setupDatabase';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export class ChainweaverAppIndex extends setupDatabase {
  private _webAuthNHelper: WebAuthNHelper = new WebAuthNHelper();
  private _PROFILENAME: string = 'He-man';
  private _PROFILENAME_WITHPASSWORD: string = 'Skeletor';
  private _PASSWORD: string = '123456';

  public constructor() {
    super();
  }

  public getWalletUrl() {
    if (process.env.WALLETURL) return process.env.WALLETURL;

    return 'https://wallet.kadena.io';
  }

  public async createAccount(actor: Page): Promise<string> {
    const listItems = await actor
      .getByTestId('assetList')
      .getByRole('listitem')
      .all();
    await expect(listItems.length).toEqual(0);

    const newAccountButton = actor.getByRole('button', {
      name: 'Account',
    });
    await newAccountButton.waitFor();
    await expect(newAccountButton).toBeVisible();
    await newAccountButton.click();

    const createAccountButton = actor.getByRole('button', {
      name: 'Create Account',
    });
    await createAccountButton.click();

    await this.signPopupWithPassword(actor);
    await actor.waitForTimeout(500);

    const newListItems = await actor
      .getByTestId('assetList')
      .getByRole('listitem')
      .all();

    await expect(newListItems.length).toEqual(1);

    const str = (await newListItems[0].allTextContents()).join('');
    const account = str.match(/\(([^)]+)\)/);

    if (!account) {
      await expect(true).toBe(false);
      return '';
    }

    return account[1] ?? '';
  }

  public async setup(
    actor: Page,
    typeName: string,
    full: boolean = true,
  ): Promise<ILoginDataProps | undefined> {
    await actor.goto(`${this.getWalletUrl()}/?env=e2e`);
    await actor.waitForTimeout(1000);

    let accountData: ILoginDataProps | undefined = undefined;

    try {
      accountData = await this.importBackup(actor, typeName);
    } catch (e) {
      const data = await this.createProfileWithPassword(actor);

      await this.goToSettings(actor);

      if (full) {
        await this.addNetwork(actor, {
          networkId: 'development',
          title: 'development',
          host: 'http://localhost:8080',
        });

        await this.selectNetwork(actor, 'Development');

        await actor.goto(`${this.getWalletUrl()}/?env=e2e`);
        await this.createAccount(actor);
      }
      accountData = await this.downloadBackup(actor, {
        profileName: data.profileName,
        phrase: data.phrase,
        typeName,
      });
    } finally {
      await actor.goto(`${this.getWalletUrl()}/?env=e2e`);
    }

    return accountData;
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
  public async createProfileWithPassword(actor: Page): Promise<{
    profileName: string;
    phrase: string;
  }> {
    await actor
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
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
      name: 'Show Phrase',
    });
    await expect(skipButton).toBeVisible();
    await skipButton.click();

    const copyButton = actor.getByRole('button', {
      name: 'Copy to clipboard',
    });

    await copyButton.click();

    const phrase: string = await actor.evaluate(
      'navigator.clipboard.readText()',
    );

    const skipButton2 = actor.getByRole('button', {
      name: 'Skip',
    });
    await skipButton2.click();

    return {
      profileName: this._PROFILENAME_WITHPASSWORD,
      phrase,
    };
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

  public async selectProfileWithPhrase(
    actor: Page,
    setupProps?: ILoginDataProps,
  ) {
    await actor.getByRole('link', { name: 'Recover your wallet' }).click();
    await actor.getByRole('link', { name: 'Recovery Phrase' }).waitFor();
    await actor.getByRole('link', { name: 'Recovery Phrase' }).click();
    await actor.locator('#phrase').waitFor();
    await actor.fill('#phrase', setupProps?.phrase ?? '');
    await actor.fill('#name', `${setupProps?.profileName ?? ''}1`);

    await actor.getByRole('button', { name: 'Prefer password' }).click();

    await actor.fill('#password', this._PASSWORD);
    await actor.fill('#confirmation', this._PASSWORD);

    const continueButton = actor.getByRole('button', {
      name: 'Continue',
    });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
    await actor
      .getByRole('button', {
        name: 'Continue',
      })
      .click();
  }

  public async selectProfile(
    actor: Page,
    profileName: string,
  ): Promise<boolean> {
    const button = actor.getByText(profileName);
    await button.waitFor();
    await expect(button).toBeVisible();
    await button.click();

    if (
      await actor
        .getByRole('heading', { name: 'Unlock your profile' })
        .isVisible()
    ) {
      await actor.fill('[id="password"]', this._PASSWORD);
      await actor.getByRole('button', { name: 'Continue' }).waitFor();
      await actor.getByRole('button', { name: 'Continue' }).click();
    }

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

    const url = await actor.evaluate(() => window.location.href);

    await expect(url).toContain('/networks');

    return true;
  }

  public async signPopupWithPassword(actor: Page): Promise<boolean> {
    await actor
      .getByRole('button', {
        name: 'Unlock',
      })
      .waitFor();

    const unlockButton = actor.getByRole('button', {
      name: 'Unlock',
    });

    if (await unlockButton.isVisible()) {
      const input = actor.getByTestId('passwordField');
      await input.waitFor();
      await input.fill(this._PASSWORD);

      await unlockButton.click();
    }

    return true;
  }
  public async signWithPassword(
    actor: Page,
    trigger: Locator,
  ): Promise<boolean> {
    const popupPromise = actor.waitForEvent('popup');
    await trigger.click();
    const walletPopup = await popupPromise;

    const signButton = walletPopup.getByTestId('signTx');
    await signButton.click();

    await this.signPopupWithPassword(walletPopup);

    return true;
  }

  public async addNetwork(
    actor: Page,
    network: { networkId: string; title: string; host: string },
  ): Promise<boolean> {
    await expect(actor.getByText('mainnet01 - Mainnet')).toBeVisible();
    await expect(actor.getByText('development - development')).toBeHidden();

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
    await actor.type('[name="hosts.0.url"]', network.host, { delay: 10 });
    await actor.locator('[name="hosts.0.url"]').blur();
    await actor.waitForTimeout(100);
    await actor.focus('[name="name"]');
    await actor.type('[name="name"]', network.title, { delay: 10 });
    await actor.focus('[name="networkId"]');
    await actor.type('[name="networkId"]', network.networkId, { delay: 10 });
    await actor.locator('[name="networkId"]').blur();

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
