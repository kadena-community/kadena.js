import type { Locator, Page } from '@playwright/test';
import CardComponent from './card.component';

export default class NavHeaderComponent {
  _page: Page;
  _componentLocator: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._componentLocator = this._page.getByTestId("kda-navheader");
  }

  public async goTo(link: string): Promise<void> {
    return this._componentLocator.getByRole('link', { name: `${link}` }).click();
  }

}
