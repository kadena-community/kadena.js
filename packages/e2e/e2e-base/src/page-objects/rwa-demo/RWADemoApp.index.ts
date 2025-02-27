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
    options?: {
      skiplogin: boolean;
    },
  ): Promise<ILoginDataRWAProps | undefined> {
    await actor.goto(`https://wallet.kadena.io/?env=e2e`);
    await actor.waitForTimeout(1000);

    const accountData = (await chainweaverApp.setup(
      actor,
      typeName,
    )) as ILoginDataRWAProps;

    await actor.goto('/');

    if (!options?.skiplogin) {
      await actor.waitForTimeout(1000);
      await actor.evaluate(
        ({ accountData }) => {
          window.localStorage.setItem(
            'rwa_development_0',
            JSON.stringify({
              address: accountData?.data.data.account[0].value.address,
              publicKey: accountData?.data.data.account[0].value.guard.keys[0],
              alias: accountData?.data.data.account[0].value.alias,
              chains: [],
              walletName: 'CHAINWEAVER',
              guard: accountData?.data.data.account[0].value.guard,
              keyset: accountData?.data.data.account[0].value.guard,
              overallBalance:
                accountData?.data.data.account[0].value.overallBalance,
            }),
          );
        },
        { accountData },
      );
    }

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

    // do not save the contract to a file.
    // we want a clean contract when every test starts

    await actor.waitForTimeout(1000);
    const contractData = await this.createAsset(actor, chainweaverApp);
    data.assetContract = contractData;

    await actor.evaluate(
      ({ data }) => {
        window.localStorage.setItem(
          'development-selected_asset',
          JSON.stringify(data.assetContract),
        );
      },
      { data },
    );
    //}

    return data;
  }

  public createContractName() {
    const getRandomChar = (): string => {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      return alphabet[Math.floor(Math.random() * alphabet.length)];
    };

    return `${getRandomChar()}${crypto.randomUUID()}`;
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
    await callback;
    await actor.waitForTimeout(1000);
    //show loading indicator
    if ((await loadingWrapper.isVisible()) && options?.waitForStart) {
      await expect(
        loadingWrapper.getByTestId('pending-transactionIcon'),
      ).toBeVisible();

      if (options?.waitForEnd) {
        await loadingWrapper
          .getByTestId('pending-transactionIcon')
          .waitFor({ state: 'detached' });
      }

      await actor.waitForTimeout(2000);
    }
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
      name: 'Chainweaver Connect',
    });
    await button.waitFor();
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

  public async addSimpleKDA(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
  ): Promise<boolean> {
    if (
      await actor
        .getByRole('heading', {
          name: 'The account has no balance to pay the gas',
        })
        .isVisible()
    ) {
      const addButton = actor.getByRole('button', {
        name: 'Add 5 KDA for Gas',
      });

      await this.checkLoadingIndicator(
        actor,
        addButton,
        chainweaverApp.signWithPassword(actor, addButton),
      );
    }

    return true;
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

    const startNewAssetButton = actor.getByRole('button', {
      name: 'Start new Asset',
    });
    await startNewAssetButton.waitFor();
    await expect(startNewAssetButton).toBeDisabled();

    await this.addSimpleKDA(actor, chainweaverApp);

    await expect(startNewAssetButton).toBeEnabled();

    return true;
  }

  public async login(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
  ): Promise<boolean> {
    console.log(1111111);

    await actor
      .getByRole('heading', {
        name: 'Login',
      })
      .waitFor();
    await expect(
      actor.getByRole('heading', {
        name: 'Login',
      }),
    ).toBeVisible();

    console.log(234234234234234234);
    const popupPromise = actor.waitForEvent('popup');

    const button = actor.getByRole('button', {
      name: 'Select a wallet',
    });
    await button.waitFor();
    await button.click();

    const chainweaverBtn = actor.getByRole('button', {
      name: 'Chainweaver',
    });

    console.log(2222, button);
    await chainweaverBtn.waitFor();
    await chainweaverBtn.click();
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

  public async createAgent(
    actor: Page,
    investorAccountProps: ILoginDataRWAProps,
    alias: string,
    chainweaverApp: ChainweaverAppIndex,
  ) {
    await actor.goto('/agents');

    await actor
      .locator('div[data-testid="agentTable"][data-isloading="false"]')
      .waitFor({ timeout: 60000 });

    await actor.waitForTimeout(1000);

    const tr = await actor.locator('table > tbody tr > td:nth-child(1)').all();

    await actor
      .getByTestId('agentsCard')
      .getByRole('button', { name: 'Add Agent' })
      .click();

    const rightAside = actor.getByTestId('rightaside');
    await actor.type(
      '[name="accountName"]',
      investorAccountProps.data.data.account[0].value.address,
      { delay: 10 },
    );
    await actor.type('[name="alias"]', alias, { delay: 10 });

    await rightAside.getByRole('checkbox').nth(0).click();
    await rightAside.getByRole('checkbox').nth(1).click();
    await rightAside.getByRole('checkbox').nth(2).click();

    const txSpinner = actor.getByTestId('agentTableTxSpinner');
    await this.checkLoadingIndicator(
      actor,
      txSpinner,
      chainweaverApp.signWithPassword(
        actor,
        rightAside.getByRole('button', { name: 'Add Agent' }),
      ),
    );

    await actor.waitForTimeout(1000);
    const newTr = await actor
      .locator('table > tbody tr > td:nth-child(1)')
      .all();
    await expect(newTr.length).toBe(tr.length + 1);
  }

  public async createInvestor(
    actor: Page,
    investorAccountProps: ILoginDataRWAProps,
    alias: string,
    chainweaverApp: ChainweaverAppIndex,
  ) {
    await actor
      .getByTestId('leftaside')
      .locator('nav > ul li:nth-child(3)')
      .click();
    await actor
      .getByTestId('investorsCard')
      .getByRole('heading', { name: 'Investors' })
      .waitFor();

    await actor
      .locator('div[data-testid="investorTable"][data-isloading="false"]')
      .waitFor({ timeout: 60000 });

    await actor.waitForTimeout(1000);

    const tr = await actor.locator('table > tbody tr > td:nth-child(1)').all();

    await actor
      .getByTestId('investorsCard')
      .getByRole('button', { name: 'Add Investor' })
      .last()
      .click();

    const rightAside = actor.getByTestId('rightaside');
    await actor.type(
      '[name="accountName"]',
      investorAccountProps.data.data.account[0].value.address,
      { delay: 10 },
    );
    await actor.type('[name="alias"]', alias, { delay: 10 });

    const txSpinner = actor.getByTestId('investorTableTxSpinner');
    await this.checkLoadingIndicator(
      actor,
      txSpinner,
      chainweaverApp.signWithPassword(
        actor,
        rightAside.getByRole('button', { name: 'Add Investor' }),
      ),
    );

    await actor.waitForTimeout(1000);
    const newTr = await actor
      .locator('table > tbody tr > td:nth-child(1)')
      .all();
    await expect(newTr.length).toBe(tr.length + 1);
  }

  public async distributeTokens(
    actor: Page,
    chainweaverApp: ChainweaverAppIndex,
    options: { startBalance: number; fill: number; endBalance: number },
  ) {
    const balanceInfo = actor.getByTestId('balance-info').first();
    await balanceInfo.waitFor();
    const balance = await this.getBalance(balanceInfo);
    await expect(balance).toBe(`${options.startBalance}`);

    const distributetokensBtn = actor.getByTestId('action-distributetokens');
    await distributetokensBtn.waitFor();
    await distributetokensBtn.click();

    const rightAside = actor.getByTestId('rightaside');
    await rightAside.locator('[name="amount"]').fill(`${options.fill}`);

    const formButton = rightAside.getByRole('button', { name: 'Distribute' });

    await this.checkLoadingIndicator(
      actor,
      distributetokensBtn,
      chainweaverApp.signWithPassword(actor, formButton),
    );

    await actor.waitForTimeout(1000);
    const newBalance = await this.getBalance(balanceInfo);
    await expect(newBalance).toBe(`${options.endBalance}`);
  }

  public async selectInvestor(actor: Page, idx: number) {
    await actor
      .locator('div[data-testid="investorTable"][data-isloading="false"]')
      .waitFor({ timeout: 60000 });

    const selectedRow = actor
      .getByTestId('investorTable')
      .locator('table > tbody tr:has(td:nth-child(1))')
      .nth(idx);

    await selectedRow.getByTestId('select-account').click();
  }

  public async getBalance(BalanceInfo: Locator) {
    const values = await BalanceInfo.allTextContents();

    const str = values[0];
    const cleanedStr = str
      .replace('balance:', '')
      .replace('Investor balance', '')
      .trim();
    const arr = cleanedStr.split(' ');

    return arr[0];
  }
}
