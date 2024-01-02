import type { Page } from '@playwright/test';
import { CardComponent } from '../../react-ui/card.component';
import { NotificationContainerComponent } from '../../react-ui/notificationContainer.component';
import { AsideComponent } from '../components/aside.component';
export class FaucetPage {
  private readonly _page: Page;
  private _card: CardComponent;
  public notification: NotificationContainerComponent;
  public asidePanel: AsideComponent;

  public constructor(page: Page) {
    this._page = page;
    this._card = new CardComponent(this._page);
    this.notification = new NotificationContainerComponent(this._page);
    this.asidePanel = new AsideComponent(this._page);
  }

  public async fundExistingAccount(
    account: string,
    chainId: string,
  ): Promise<void> {
    await this._card.setValueForTextbox(
      'The account name to fund coins to',
      account,
    );
    await this._card.setValueForCombobox('Select Chain ID', chainId);
    await this._page.getByRole('button', { name: 'Fund 100 Coins' }).click();
  }
}
