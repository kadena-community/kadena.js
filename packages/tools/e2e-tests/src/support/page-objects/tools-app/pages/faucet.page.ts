import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';
import type { IAccount } from '../../../types/accountTypes';
import { CardComponent } from '../../react-ui/card.component';
import { NotificationContainerComponent } from '../../react-ui/notificationContainer.component';
import { AsideComponent } from '../components/aside.component';

export class FaucetPage {
  private readonly _page: Page;
  private _card: CardComponent;
  public notificationComponent: NotificationContainerComponent;
  public asidePanel: AsideComponent;
  private readonly _i18n = getI18nInstance();

  public constructor(page: Page) {
    this._page = page;
    this._card = new CardComponent(this._page);
    this.notificationComponent = new NotificationContainerComponent(this._page);
    this.asidePanel = new AsideComponent(this._page);
  }

  public async fundExistingAccount(
    account: string,
    chainId: string,
  ): Promise<void> {
    await this._card._chain.setValueForListBox(
      'Select Chain ID',
      'Select Chain ID Chain ID',
      chainId,
    );

    await this._card.setValueForTextbox(
      'The account name to fund coins to',
      account,
    );
    await expect(
      this._page.getByRole('textbox', {
        name: 'The account name to fund coins to',
      }),
    ).toHaveValue(account);

    await this._page.getByRole('button', { name: 'Fund 100 Coins' }).click();
  }

  public async CreateFundAccount(account: IAccount): Promise<void> {
    for (const keyPair of account.keys) {
      await this._card.setValueForTextbox('Public Key', keyPair.publicKey);
      await this._card.clickButton('Add Public Key');
    }
    await this._card._chain.setValueForListBox(
      'Select Chain ID',
      'Select Chain ID Chain ID',
      account.chains[0],
    );

    await expect(
      this._page.getByRole('textbox', {
        name: 'The account name to fund coins to',
      }),
    ).toHaveValue(account.account);
    //Form validation is retriggered after setting the chain. Explicitly wait for the Account Name to be visible before pressing fund.

    await this._page
      .getByRole('button', { name: this._i18n.t(`Create and Fund Account`) })
      .click();
  }
}
