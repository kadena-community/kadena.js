import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { ChainweaverAppIndex } from '../chainweaver/chainweaverApp.index';
import type { ILoginDataProps } from '../chainweaver/setupDatabase';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

type IOptions =
  | undefined
  | {
      waitForEnd?: boolean;
      waitForStart?: boolean;
    };

export class RWADemoAppIndex {
  private NAMESPACE;
  private CONTRACTNAME = 'He-man';

  public constructor() {}

  public async setup(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
    typeName: string,
  ): Promise<ILoginDataProps | undefined> {
    await actor.goto(`${process.env.WALLETURL}/?env=e2e`);
    await actor.waitForTimeout(1000);

    let accountData;
    try {
      accountData = await chainweaverApp.importBackup(actor, typeName);
    } catch (e) {
      const { profileName, phrase } = await chainweaverApp.setup(actor);

      await chainweaverApp.selectNetwork(actor, 'development');
      await actor.goto(`${process.env.WALLETURL}/?env=e2e`);
      await chainweaverApp.createAccount(actor);

      accountData = await chainweaverApp.restoreBackup(actor, {
        profileName,
        phrase,
        typeName,
      });
    } finally {
      await actor.goto(`${process.env.WALLETURL}/?env=e2e`);
    }

    return accountData;
  }

  public async createAsset(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
  ): Promise<string> {
    await actor
      .getByRole('button', {
        name: 'Start new Asset',
      })
      .waitFor();

    await actor
      .getByRole('button', {
        name: 'Start new Asset',
      })
      .isEnabled();

    await actor
      .getByRole('button', {
        name: 'Start new Asset',
      })
      .click();

    const createContractButton = actor.getByRole('button', {
      name: 'Create the contract',
    });

    await expect(createContractButton).toBeDisabled();

    this.NAMESPACE = await actor.getByTestId('namespaceField').inputValue();
    await expect(this.NAMESPACE.startsWith('n_')).toEqual(true);
    await actor.fill('#contractName', this.CONTRACTNAME);

    await expect(createContractButton).toBeEnabled();

    await this.checkLoadingIndicator(
      actor,
      createContractButton,
      chainweaverApp.signWithPassword(actor, createContractButton),
      {
        waitForEnd: false,
      },
    );

    await actor.getByRole('heading', { name: this.CONTRACTNAME }).waitFor();

    return this.NAMESPACE;
  }

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
    options: IOptions = {
      waitForEnd: true,
      waitForStart: true,
    },
  ): Promise<void> {
    // await expect(
    //   loadingWrapper.getByTestId('no-pending-transactionIcon'),
    // ).toBeVisible();
    // await expect(
    //   loadingWrapper.getByTestId('pending-transactionIcon'),
    // ).toBeHidden();
    await callback;
    // //show loading indicator
    // if ((await loadingWrapper.isVisible()) && options?.waitForStart) {
    //   await expect(
    //     loadingWrapper.getByTestId('no-pending-transactionIcon'),
    //   ).toBeHidden();
    //   await expect(
    //     loadingWrapper.getByTestId('pending-transactionIcon'),
    //   ).toBeVisible();
    //   if ((await loadingWrapper.isVisible()) && options?.waitForEnd) {
    //     await loadingWrapper
    //       .getByTestId('no-pending-transactionIcon')
    //       .waitFor();
    //     await expect(
    //       loadingWrapper.getByTestId('no-pending-transactionIcon'),
    //     ).toBeVisible();
    //     await expect(
    //       loadingWrapper.getByTestId('pending-transactionIcon'),
    //     ).toBeHidden();
    //   }
    // }
  }

  public async getAssetLink(actor: Page): Promise<string> {
    const copyButton = actor.getByTestId('copyAsset');
    await copyButton.click();

    const shareUrl: string = await actor.evaluate(
      'navigator.clipboard.readText()',
    );
    return shareUrl;
  }

  public async loginWithPhrase(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
    setupProps?: ILoginDataProps,
  ) {
    if (!setupProps) {
      console.error('no setup props were found');
      throw new Error('no setup props were found');
    }

    await actor.goto('/');
    await actor
      .getByRole('heading', {
        name: 'Login',
      })
      .waitFor();

    const popupPromise = actor.waitForEvent('popup');
    const button = actor.getByRole('button', {
      name: 'Connect',
    });
    await button.click();
    const walletPopup = await popupPromise;

    const loginAcceptButton = walletPopup.getByRole('button', {
      name: 'Accept',
    });

    await actor.waitForTimeout(1000);
    if (await loginAcceptButton.isHidden()) {
      await chainweaverApp.selectProfileWithPhrase(walletPopup, setupProps);
    }

    await actor.waitForTimeout(500000000);
  }

  public async login(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
  ): Promise<boolean> {
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

    await actor.waitForTimeout(1000);
    if (await loginAcceptButton.isHidden()) {
      await chainweaverApp.selectProfile(walletPopup, 'Skeletor');
    }

    await loginAcceptButton.waitFor();
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
