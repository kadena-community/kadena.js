import type { Locator, Page } from '@playwright/test';

export default class NavHeaderComponent {
  private _page: Page;
  public _componentLocator: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._componentLocator = this._page.getByTestId('kda-navheader');
  }

  public async goTo(link: string): Promise<void> {
    return this._componentLocator
      .getByRole('link', { name: `${link}` })
      .click();
  }
}
