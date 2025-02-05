import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { ChainweaverAppIndex } from '../chainweaver/chainweaverApp.index';
import type { ILoginDataProps } from '../chainweaver/setupDatabase';

type IOptions =
  | undefined
  | {
      waitForEnd?: boolean;
      waitForStart?: boolean;
    };

interface ICompliance {
  isActive: boolean;
  value: number;
  key: string;
}

export type ILoginDataRWAProps = ILoginDataProps & {
  assetContract?: {
    namespace?: string;
    contractName?: string;
    investorCount?: number;
    supply?: number;
    uuid?: string;
    compliance?: {
      maxSupply?: ICompliance;
      maxBalance?: ICompliance;
      maxInvestors?: ICompliance;
    };
  };
};

export class RWADemoAppIndex {
  private NAMESPACE;
  private CONTRACTNAME = 'He-man';

  public constructor() {}

  public async setup(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
    typeName: string,
  ): Promise<ILoginDataRWAProps | undefined> {
    await actor.goto(`https://wallet.kadena.io/?env=e2e`);
    await actor.waitForTimeout(1000);

    const accountData = (await chainweaverApp.setup(
      actor,
      typeName,
    )) as ILoginDataRWAProps;

    await actor.goto('/');

    await actor.waitForTimeout(1000);
    await actor.evaluate(
      ({ accountData }) => {
        window.localStorage.setItem(
          'rwa_development_0',
          JSON.stringify({
            address: accountData?.data.data.account[0].value.address,
            alias: accountData?.data.data.account[0].value.alias,
            chains: [],
            guard: accountData?.data.data.account[0].value.guard,
            overallBalance:
              accountData?.data.data.account[0].value.overallBalance,
          }),
        );
      },
      { accountData },
    );

    await actor.goto('/');
    await actor.waitForTimeout(1000);

    return accountData;
  }

  public async setupAppend(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
    typeName: string,
  ): Promise<ILoginDataRWAProps> {
    const data = (await chainweaverApp.getSetupProps(
      typeName,
    )) as ILoginDataRWAProps;

    await actor.goto('/');
    await actor.waitForTimeout(1000);
    await this.cookieConsent(actor);

    if (
      await actor
        .getByRole('heading', {
          name: 'The account has no balance to pay the gas',
        })
        .isVisible()
    ) {
      await this.addKDA(actor, chainweaverApp);
    }

    if (!data.assetContract) {
      const contractData = await this.createAsset(actor, chainweaverApp);
      console.log(44444, contractData);
      data.assetContract = contractData;

      await chainweaverApp.setSetupProps(typeName, data);

      await actor.evaluate(
        ({ data }) => {
          window.localStorage.setItem(
            'development-selected_asset',
            JSON.stringify(data.assetContract),
          );
        },
        { data },
      );
    }

    return data;
  }

  public createContractName() {
    return `${crypto.randomUUID()}`;
  }

  public async createAsset(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
  ): Promise<ILoginDataRWAProps['assetContract']> {
    const CONTRACTNAME = this.createContractName();
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
    await actor.fill('#contractName', CONTRACTNAME);

    await expect(createContractButton).toBeEnabled();

    await this.checkLoadingIndicator(
      actor,
      createContractButton,
      chainweaverApp.signWithPassword(actor, createContractButton),
      {
        waitForEnd: false,
      },
    );

    await actor.getByRole('heading', { name: CONTRACTNAME }).waitFor();

    return {
      namespace: this.NAMESPACE,
      contractName: CONTRACTNAME,
      uuid: '1',
      investorCount: 0,
      supply: -1,
      compliance: {
        maxSupply: {
          isActive: false,
          value: -1,
          key: 'RWA.supply-limit-compliance',
        },
        maxBalance: {
          isActive: false,
          value: -1,
          key: 'RWA.max-balance-compliance',
        },
        maxInvestors: {
          isActive: false,
          value: -1,
          key: 'RWA.max-investors-compliance',
        },
      },
    };
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

  public async addKDA(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
  ): Promise<boolean> {
    await expect(
      actor.getByRole('heading', {
        name: 'Add an asset',
      }),
    ).toBeVisible();

    await expect(
      actor.getByRole('heading', {
        name: 'The account has no balance to pay the gas',
      }),
    ).toBeVisible();

    const addButton = actor.getByRole('button', {
      name: 'Add 5 KDA for Gas',
    });

    const startNewAssetButton = actor.getByRole('button', {
      name: 'Start new Asset',
    });
    await startNewAssetButton.waitFor();
    await expect(startNewAssetButton).toBeDisabled();

    await this.checkLoadingIndicator(
      actor,
      addButton,
      chainweaverApp.signWithPassword(actor, addButton),
    );

    await expect(startNewAssetButton).toBeEnabled();

    return true;
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
