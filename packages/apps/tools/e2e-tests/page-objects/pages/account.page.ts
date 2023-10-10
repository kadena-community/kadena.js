import NavHeaderComponent from '@kadena/e2e-components/shared-components/navHeader.component';

import type { Page } from '@playwright/test';

export default class AccountPage {
  private readonly page: Page;
  private header: NavHeaderComponent;

  public constructor(page: Page) {
    this.page = page;
    this.header = new NavHeaderComponent(this.page);
  }
}
