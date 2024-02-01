import type { Locator, Page } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';
import { NavHeaderComponent } from '../../react-ui/navHeader.component';

export class ToolsHeaderComponent extends NavHeaderComponent {
  private readonly _i18n = getI18nInstance();

  public constructor(page: Page) {
    super(page);
    this._page = page;
  }

  public async goToPage(translationKey: string): Promise<void> {
    return this._component
      .getByRole('link', { name: this._i18n.t(translationKey) })
      .click();
  }

  public async setNetwork(networkLabel: string): Promise<string[]> {
    return this._component.getByRole('combobox').selectOption(networkLabel);
  }

  public async getNetwork(): Promise<Locator> {
    return this._component.getByRole('combobox');
  }
}
