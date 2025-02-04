import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { ChainweaverAppIndex } from '../chainweaver/chainweaverApp.index';

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
  ): Promise<string> {
    await actor.goto('https://wallet.kadena.io');
    await chainweaverApp.setup(actor);
    await chainweaverApp.selectNetwork(actor, 'development');

    const data = await actor.evaluate(async () => {
      return new Promise((resolve) => {
        /**
         * Export all data from an IndexedDB database
         * @param {IDBDatabase} idbDatabase - to export from
         * @param {function(Object?, string?)} cb - callback with signature (error, jsonString)
         */
        async function exportToJsonString(idbDatabase, cb) {
          const exportObject = {};
          const objectStoreNamesSet = new Set(idbDatabase.objectStoreNames);
          const size = objectStoreNamesSet.size;
          if (size === 0) {
            cb(null, JSON.stringify(exportObject));
          } else {
            const objectStoreNames = Array.from(objectStoreNamesSet);
            const transaction = idbDatabase.transaction(
              objectStoreNames,
              'readonly',
            );
            transaction.onerror = (event) => cb(event, null);

            objectStoreNames.forEach((storeName: string) => {
              const allObjects: any[] = [];
              transaction.objectStore(storeName).openCursor().onsuccess = (
                event,
              ) => {
                const cursor = event.target.result as IDBCursorWithValue;
                if (cursor) {
                  allObjects.push(cursor.value);
                  cursor.continue();
                } else {
                  exportObject[storeName] = allObjects;
                  if (
                    objectStoreNames.length === Object.keys(exportObject).length
                  ) {
                    cb(null, JSON.stringify(exportObject));
                  }
                }
              };
            });
          }
        }
        const walletDBRequest = indexedDB.open('dev-wallet');

        walletDBRequest.onsuccess = (event) => {
          // store the result of opening the database in the db variable. This is used a lot below
          const db = walletDBRequest.result;

          return exportToJsonString(db, async (err, json) => {
            resolve(JSON.parse(json ?? '{}'));
          });
        };
      });
    });

    console.log(111111, { data });
    await expect(true).toBe(false);

    await actor.goto('https://wallet.kadena.io/');
    const account = await chainweaverApp.createAccount(actor);

    await actor.goto('/');
    await this.cookieConsent(actor);
    await this.login(actor);

    const addButton = actor.getByRole('button', {
      name: 'Add 5 KDA for Gas',
    });
    await chainweaverApp.signWithPassword(actor, addButton);
    await this.createAsset(actor, chainweaverApp);

    return account;
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
