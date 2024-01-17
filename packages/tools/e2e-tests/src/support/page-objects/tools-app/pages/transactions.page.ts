import type { Page } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';
import { CardComponent } from '../../react-ui/card.component';
import { AsideComponent } from '../components/aside.component';

export class TransactionsPage {
  private readonly _page: Page;
  public asidePanel: AsideComponent;
  private readonly _i18n = getI18nInstance();
  private _card: CardComponent;

  public constructor(page: Page) {
    this._page = page;
    this.asidePanel = new AsideComponent(this._page);
    this._card = new CardComponent(this._page);
  }

  public async getTransactionDetails(requestKey: string): Promise<void> {
    await this._card.setValueForTextbox(
      this._i18n.t(`Request Key`),
      requestKey,
    );
    await this._page.getByRole('button', { name: 'Search' }).click();
  }
}
