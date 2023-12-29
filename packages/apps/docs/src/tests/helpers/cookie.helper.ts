import type { Locator, Page } from '@playwright/test';

export default class CookieHelper {
  private readonly _page: Page;
  private _consentBar: Locator;
  private _acceptButton: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._consentBar = this._page.getByRole('region', {
      name: 'Cookie Consent',
    });
    this._acceptButton = this._consentBar.getByRole('button', {
      name: 'Accept',
    });
  }

  public async acceptCookies(): Promise<void> {
    await this._acceptButton.click();
  }
}
