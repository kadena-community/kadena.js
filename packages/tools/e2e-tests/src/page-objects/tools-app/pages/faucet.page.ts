import { CardComponent } from '../../react-ui/card.component';
import { NotificationContainerComponent } from '../../react-ui/notificationContainer.component';

import type { Page } from '@playwright/test';

export class FaucetPage {
  private readonly _page: Page;
  private _card: CardComponent;
  public notification: NotificationContainerComponent;

  public constructor(page: Page) {
    this._page = page;
    this._card = new CardComponent(this._page);
    this.notification = new NotificationContainerComponent(this._page);
  }

  public async fundExistingAccount(
    account: string,
    chainId: string,
  ): Promise<void> {
    await this._page.getByRole('link', { name: ' this page' }).click();
    await this._card.setValueForTextbox(
      'Account',
      account,
    );
    await this._card.setValueForCombobox('Select Chain ID', chainId);
    await this._page.getByRole('button', { name: 'Fund 100 Coins' }).click();
  }
}
