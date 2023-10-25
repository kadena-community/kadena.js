import type { Page } from '@playwright/test';
import { ToolsHeaderComponent } from '../components/toolsHeader.component';

export class HomePage {
  private readonly _page: Page;
  public header: ToolsHeaderComponent;

  public constructor(page: Page) {
    this._page = page;
    this.header = new ToolsHeaderComponent(this._page);
  }
}
