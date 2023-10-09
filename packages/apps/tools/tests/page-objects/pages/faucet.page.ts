import type { Page } from '@playwright/test';
import CardComponent from '@kadena/e2e-components/shared-components/card.component';
import NotificationContainerComponent from '@kadena/e2e-components/shared-components/notificationContainer.component'

export default class FaucetPage {
  private readonly page: Page;
  private card: CardComponent;
  public notification: NotificationContainerComponent


  public constructor(page: Page) {
    this.page = page;
    this.card = new CardComponent(this.page);
    this.notification = new NotificationContainerComponent(this.page)
  }

  async fundAccount(account: string, chainId: string): Promise<void> {
    await this.card.setValueForTextbox(
      'The Account Name You Would Like To Fund Coins To',
      account);
    await this.card.setValueForCombobox('Select Chain ID', chainId)
    await this.page.getByRole('button', {name: 'Fund 100 Coins'}).click()
  }
}
