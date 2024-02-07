import { CardComponent } from '@page-objects/react-ui/card.component';
import { NotificationContainerComponent } from '@page-objects/react-ui/notificationContainer.component';
import { AsideComponent } from '@page-objects/tools-app/components/aside.component';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';

export class FundExistingAccountPage {
  private readonly _page: Page;
  public asidePanel: AsideComponent;
  private readonly _i18n = getI18nInstance();
  private _accountCard: CardComponent;
  public processingNotification: NotificationContainerComponent;
  public transactionFinishedNotification: NotificationContainerComponent;

  public constructor(page: Page) {
    this._page = page;
    this._accountCard = new CardComponent(this._page, 'Account');
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

  public async fundExistingAccount(
    account: string,
    chainId: string,
  ): Promise<void> {
    await this._accountCard._chain.setValueForListBox(
      'Select Chain ID',
      'Select Chain ID Chain ID',
      chainId,
    );

    await this._accountCard.setValueForTextbox(
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
}
