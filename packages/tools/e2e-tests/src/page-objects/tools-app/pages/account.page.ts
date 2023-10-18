import type { Page } from '@playwright/test';

export class AccountPage {
  private readonly _page: Page;

  public constructor(page: Page) {
    this._page = page;
  }
}
