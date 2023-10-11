import type { Locator, Page } from '@playwright/test';
import CardComponent from '@kadena/e2e-components/shared-components/card.component';
import NavHeaderComponent from '@kadena/e2e-components/shared-components/navHeader.component';

export default class AsideComponent {
  public networkCard: CardComponent;
  private _page: Page;

  constructor(page: Page) {
    this._page = page;
  }

  public async navigateTo(ariaLabel: string): Promise<void> {
    await this._page.getByRole('button', {name: ariaLabel}).click()
  }

}
