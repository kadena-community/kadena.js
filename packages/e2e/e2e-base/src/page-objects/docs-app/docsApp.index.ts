import type { Page } from '@playwright/test';
import TreeHelper from '../../helpers/docs/tree.helper';

export class DocsAppIndex {
  public treeHelper: TreeHelper;
  private readonly _page: Page;

  public constructor(page: Page) {
    this._page = page;
    this.treeHelper = new TreeHelper(this._page);
  }
}
