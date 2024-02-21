import type { Locator, Page } from '@playwright/test';

export class HomePage {
  private readonly _page: Page;
  private _loginButton: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._loginButton = this._page.getByRole('button', { name: 'Login' });
  }

  public async login(): Promise<void> {
    await this._loginButton.click();
  }
}
