import type { Page } from '@playwright/test';
import ToolsHeaderComponent from '../components/toolsHeader.component';

export default class HomePage {
  private readonly page: Page;
  public header: ToolsHeaderComponent;

  public constructor(page: Page) {
    this.page = page;
    this.header = new ToolsHeaderComponent(this.page);
  }
}
