import type { Page } from '@playwright/test';
import { AsideComponent } from '../components/aside.component';

export class TransactionsPage {
  private readonly _page: Page;
  public aside: AsideComponent;

  public constructor(page: Page) {
    this._page = page;
    this.aside = new AsideComponent(this._page);
  }
}
