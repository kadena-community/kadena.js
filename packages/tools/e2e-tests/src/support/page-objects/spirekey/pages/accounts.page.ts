import type { Locator, Page } from '@playwright/test';

export class AccountsPage {
  private readonly _page: Page;
  private _accountName: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._accountName = this._page.getByTestId('accountName');
  }

  public getAccountName(): Locator {
    return this._accountName;
  }
}
