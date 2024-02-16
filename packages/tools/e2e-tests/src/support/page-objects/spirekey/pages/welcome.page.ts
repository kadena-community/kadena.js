import type { Locator, Page } from '@playwright/test';

export class WelcomePage {
  private readonly _page: Page;
  private _loginButton: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._loginButton = this._page.getByRole('link', { name: 'register' });
  }

  public async clickRegister(): Promise<void> {
    await this._loginButton.click();
  }
}
