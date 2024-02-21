import MenuComponent from '@page-objects/docs/components/menu.component';
import CookieConsentComponent from '@page-objects/shared-components/cookie-consent.component';
import type { Page } from '@playwright/test';

export class DocsAppIndex {
  private readonly _page: Page;
  public cookieConsentComponent: CookieConsentComponent;
  public menuComponent: MenuComponent;

  public constructor(page: Page) {
    this._page = page;
    this.cookieConsentComponent = new CookieConsentComponent(this._page);
    this.menuComponent = new MenuComponent(this._page);
  }
}
