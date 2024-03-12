import { ToolsHeaderComponent } from '@page-objects/tools-app/components/toolsHeader.component';
import type { Page } from '@playwright/test';

export class HomePage {
  private readonly _page: Page;
  public header: ToolsHeaderComponent;

  public constructor(page: Page) {
    this._page = page;
    this.header = new ToolsHeaderComponent(this._page);
  }
}
