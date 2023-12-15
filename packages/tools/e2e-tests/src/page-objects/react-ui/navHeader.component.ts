import type { Locator, Page } from '@playwright/test';

export class NavHeaderComponent {
  protected _page: Page;
  protected _component: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._component = this._page.locator('header');
  }
}
