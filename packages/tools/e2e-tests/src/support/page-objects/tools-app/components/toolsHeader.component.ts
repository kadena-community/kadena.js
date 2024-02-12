import { ListBoxComponent } from '@page-objects/react-ui/listBox.component';
import { NavHeaderComponent } from '@page-objects/react-ui/navHeader.component';
import type { Page } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';

export class ToolsHeaderComponent extends NavHeaderComponent {
  private readonly _i18n = getI18nInstance();
  public networkListBox: ListBoxComponent;

  public constructor(page: Page) {
    super(page);
    this._page = page;
    this.networkListBox = new ListBoxComponent(this._page);
  }

  public async goToPage(translationKey: string): Promise<void> {
    return this._component
      .getByRole('link', { name: this._i18n.t(translationKey) })
      .click();
  }

  public async setNetwork(networkLabel: string): Promise<void> {
    await this.networkListBox.setValueForListBox(
      'Testnet Select Network',
      'Select Network',
      networkLabel,
    );
  }
}
