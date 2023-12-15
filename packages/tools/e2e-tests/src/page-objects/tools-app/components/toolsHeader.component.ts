import type { Locator, Page } from '@playwright/test';
import { CardComponent } from '../../react-ui/card.component';
import { NavHeaderComponent } from '../../react-ui/navHeader.component';
import { getI18nInstance } from 'playwright-i18next-fixture';

export class ToolsHeaderComponent extends NavHeaderComponent {
  public networkCard: CardComponent;
  private readonly _i18n = getI18nInstance()

  public constructor(page: Page) {
    super(page);
    this._page = page;
    this.networkCard = new CardComponent(page);

  }

  public async goToPage(translationKey: string): Promise<void> {
    return this._component.getByRole('link', { name: this._i18n.t(translationKey)}).click();
  }

  public async setNetwork(networkLabel: string): Promise<string[]> {
    return this._component.getByRole('combobox').selectOption(networkLabel);
  }

  public async getNetwork(): Promise<Locator> {
    return this._component.getByRole('combobox');
  }
}
