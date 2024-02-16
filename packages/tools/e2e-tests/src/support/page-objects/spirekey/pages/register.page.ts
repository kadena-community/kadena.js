import { WebAuthNHelper } from '@helpers/spirekey/webauthn.helper';
import type { Locator, Page } from '@playwright/test';

export class RegisterPage {
  private readonly _page: Page;
  private _aliasInput: Locator;
  private _nextButton: Locator;
  private _testnetButton: Locator;
  private _webAuthN: WebAuthNHelper;
  private _laptopButton: Locator;
  private _completeButton: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._aliasInput = this._page.getByPlaceholder('Your alias');
    this._nextButton = this._page.getByRole('button', { name: 'Next' });
    this._testnetButton = this._page.locator('[for="network-testnet"]');
    this._webAuthN = new WebAuthNHelper(this._page);
    this._laptopButton = this._page.locator('[for="deviceType-desktop"]');
    this._completeButton = this._page.getByRole('button', { name: 'Complete' });
  }

  public async setAlias(alias: string): Promise<void> {
    await this._aliasInput.fill(alias);
  }

  public async next(): Promise<void> {
    await this._nextButton.click();
  }

  public async selectTestnet(): Promise<void> {
    await this._testnetButton.click();
  }

  public async setDesktop(): Promise<void> {
    await this._laptopButton.click();
  }

  public async complete(): Promise<void> {
    await this._completeButton.click();
  }

  public async register(alias: string): Promise<string> {
    await this.setAlias(alias);
    await this.next();
    await this.selectTestnet();
    await this.next();
    await this._webAuthN.enableWebAuthN();
    await this.next();
    await this.setDesktop();
    await this.next();
    await this.complete();
    const account = await this.waitForAccountCreation();
    return account;
  }

  public async waitForAccountCreation(): Promise<string> {
    const response = await this._page.waitForResponse(
      (resp) => resp.url().includes('listen') && resp.status() === 200,
    );
    const json = await response.json();
    return json.result.data;
  }
}
