import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { ChainweaverAppIndex } from '../chainweaver/chainweaverApp.index';

export class RWADemoAppIndex {
  private NAMESPACE;
  private CONTRACTNAME = 'He-man';

  public constructor() {}

  public async setup(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
  ): Promise<void> {
    await actor.goto('https://wallet.kadena.io');
    await chainweaverApp.setup(actor);
    await chainweaverApp.selectNetwork(actor, 'development');
    await actor.goto('https://wallet.kadena.io/');
    await chainweaverApp.createAccount(actor);

    await actor.goto('/');
    await this.cookieConsent(actor);
    await this.login(actor);

    const addButton = actor.getByRole('button', {
      name: 'Add 5 KDA for Gas',
    });
    await chainweaverApp.signWithPassword(actor, addButton);
    await this.createAsset(actor, chainweaverApp);
  }

  public async createAsset(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
  ): Promise<string> {
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
    );

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
