import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';
import type { IAccount } from '../../../../types/account.types';
import { CardComponent } from '../../../react-ui/card.component';
import { NotificationContainerComponent } from '../../../react-ui/notificationContainer.component';
import { AsideComponent } from '../../components/aside.component';

export class FundNewAccountPage {
  private readonly _page: Page;
  public asidePanel: AsideComponent;
  private readonly _i18n = getI18nInstance();
  private _accountCard: CardComponent;
  private _publicKeysCard: CardComponent;
  public processingNotification: NotificationContainerComponent;
  public transactionFinishedNotification: NotificationContainerComponent;

  public constructor(page: Page) {
    this._page = page;
    this._accountCard = new CardComponent(this._page, 'Account');
    this._publicKeysCard = new CardComponent(this._page, 'Public Keys');
    this.processingNotification = new NotificationContainerComponent(
      this._page,
      'Transaction is being processed...',
    );
    this.transactionFinishedNotification = new NotificationContainerComponent(
      this._page,
      'Transaction successfully completed',
    );
    this.asidePanel = new AsideComponent(this._page);
  }

  public async CreateFundAccount(account: IAccount): Promise<void> {
    for (const keyPair of account.keys) {
      await this._publicKeysCard.setValueForTextbox(
        'Public Key',
        keyPair.publicKey,
      );
      await this._publicKeysCard.clickButton('Add Public Key');
    }
    await this._accountCard._chain.setValueForListBox(
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
