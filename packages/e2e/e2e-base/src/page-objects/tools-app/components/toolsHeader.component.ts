import type { Page } from '@playwright/test';
import { ListBoxComponent } from '../../kode-ui/listBox.component';
import { NavHeaderComponent } from '../../kode-ui/navHeader.component';

export class ToolsHeaderComponent extends NavHeaderComponent {
  public networkListBox: ListBoxComponent;

  public constructor(page: Page) {
    super(page);
    this._page = page;
    this._component = this._page.locator('header');
    this.networkListBox = new ListBoxComponent(
      this._page,
      'Testnet Select Network',
      'Select Network',
    );
  }

  public async goToPage(label: string): Promise<void> {
    return this._component.getByRole('link', { name: label }).click();
  }

  public async setNetwork(networkLabel: string): Promise<void> {
    await this.networkListBox.setValue(networkLabel);
  }
}
