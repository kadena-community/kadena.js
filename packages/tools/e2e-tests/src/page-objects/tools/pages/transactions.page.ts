import NavHeaderComponent from '../../react-ui/navHeader.component';

import type { Page } from '@playwright/test';

export default class FaucetPage {
  private readonly page: Page;
  private header: NavHeaderComponent;

  public constructor(page: Page) {
    this.page = page;
    this.header = new NavHeaderComponent(this.page);
  }
}
