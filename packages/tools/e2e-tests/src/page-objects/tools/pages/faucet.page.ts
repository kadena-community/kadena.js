import type { Page } from '@playwright/test';
import ToolsHeader from '../components/toolsHeader.component';
import ToolsHeaderComponent from '../components/toolsHeader.component';

export default class FaucetPage {
  private readonly page: Page;
  private header: ToolsHeaderComponent;

  public constructor(page: Page) {
    this.page = page;
    this.header = new ToolsHeader(this.page);
  }
}
