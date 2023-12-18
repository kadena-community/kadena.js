import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';
import type { IAccountWithSecretKey } from '../../../types/accounts';
import { CardComponent } from '../../react-ui/card.component';
import { NotificationContainerComponent } from '../../react-ui/notificationContainer.component';
import { AsideComponent } from '../components/aside.component';

export class FaucetPage {
  private readonly _page: Page;
  private _card: CardComponent;
  public notification: NotificationContainerComponent;
  public asidePanel: AsideComponent;
  private readonly _i18n = getI18nInstance();

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
      'The Account Name You Would Like To Fund Coins To',
      account,
    );
    await this._card.setValueForCombobox(this._i18n.t(`Chain ID`), chainId);
    await this._page.getByRole('button', { name: 'Fund 100 Coins' }).click();
  }

  public async fundNewAccount(account: IAccountWithSecretKey): Promise<void> {
    await this._card.setValueForTextbox('Public Key', account.publicKey);
    await this._card.clickButton('Add Public Key');
    await this._card.setValueForCombobox(
      this._i18n.t(`Chain ID`),
      account.chainId,
    );
    //Form validation is retriggered after setting the chain. Explicitly wait for the Account Name to be visible before pressing fund.
    await expect(
      this._page.getByRole('textbox', {
        name: 'The Account Name To Fund Coins To',
      }),
    ).toHaveValue(account.account);
    await this._page.getByRole('button', { name: 'Fund 100 Coins' }).click();
  }
}
