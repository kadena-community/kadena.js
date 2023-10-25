import type { Locator, Page } from '@playwright/test';
import { AsideComponent } from '../components/aside.component';

export class ModuleExplorerPage {
  private readonly _page: Page;
  public aside: AsideComponent;

  public constructor(page: Page) {
    this._page = page;
    this.aside = new AsideComponent(this._page);
  }

  public async searchModule(moduleName: string): Promise<void> {
    await this._page.getByRole('textbox', { name: 'search' }).fill(moduleName);
  }

  public async getDeployedContracts(): Promise<Locator> {
    return this._page.getByRole('treeitem');
  }

  public async openDeployedContract(
    moduleName: string,
    chain: string,
  ): Promise<void> {
    await this._page.getByRole('treeitem', { name: moduleName }).click();
    await this._page.getByRole('button', { name: chain, exact: true }).click();
  }

  public async getEditor(): Promise<Locator> {
    return this._page.locator('id=ace-editor');
  }
}
