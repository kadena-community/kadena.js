import NavHeaderComponent from '@kadena/e2e-components/shared-components/navHeader.component';

import type { Locator, Page } from '@playwright/test';
import AsideComponent from '../components/aside.component';
import * as module from 'module';

export default class ModuleExplorerPage {
  private readonly page: Page;
  public aside: AsideComponent;

  public constructor(page: Page) {
    this.page = page;
  }

  async searchModule(moduleName: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'search' }).fill(moduleName);
  }

  async getDeployedContracts(): Promise<Locator> {
    return this.page.getByRole('treeitem');
  }

  async openDeployedContract(moduleName: string, chain: string): Promise<void> {
    await this.page.getByRole('treeitem', { name: moduleName }).click();
    await this.page.getByRole('button', { name: chain, exact: true }).click();
  }

  async getEditor(): Promise<Locator> {
    return this.page.locator('id=ace-editor');
  }
}
