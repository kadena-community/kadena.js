import NavHeaderComponent from '@kadena/e2e-components/shared-components/navHeader.component';

import type { Page } from '@playwright/test';
import AsideComponent from '../components/aside.component';

export default class TransactionsPage {
  private readonly page: Page;
  public aside: AsideComponent;

  public constructor(page: Page) {
    this.page = page;
    this.aside = new AsideComponent(this.page);
  }
}
