import type { Page } from '@playwright/test';
import { AsideComponent } from '../components/aside.component';

export class TransactionsPage {
  private readonly _page: Page;
  public asidePanel: AsideComponent;

  public constructor(page: Page) {
    this._page = page;
    this.asidePanel = new AsideComponent(this._page);
  }
}
