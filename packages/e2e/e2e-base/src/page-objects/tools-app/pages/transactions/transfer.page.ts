import { generateAccount } from '@helpers/client-utils/accounts.helper';
import { CardComponent } from '@page-objects/react-ui/card.component';
import { NotificationContainerComponent } from '@page-objects/react-ui/notificationContainer.component';
import type { Page } from '@playwright/test';

export class TransferPage {
  private readonly _page: Page;
  public senderCard: CardComponent;
  public receiverCard: CardComponent;
  succesNotification: NotificationContainerComponent;

  public constructor(page: Page) {
    this._page = page;
    this.senderCard = new CardComponent(this._page, 'Sender');
    this.receiverCard = new CardComponent(this._page, 'Receiver');
    this.succesNotification = new NotificationContainerComponent(
      this._page,
      'Transaction successfully completed',
    );
  }

  public async setSender(valueToSelect = 'Ledger'): Promise<void> {
    await this.senderCard.setValueForListBox(
      'Ledger From',
      'From',
      valueToSelect,
    );
  }

  public async setSenderAccount(account: string): Promise<void> {
    await this.senderCard.setValueForTextbox('Account Name', account);
  }

  public async setKeyIndex(value: string): Promise<void> {
    await this.senderCard.setValueForTextbox('Key Index', value);
  }

  public async setAmount(value: string): Promise<void> {
    await this.senderCard.setValueForTextbox('Amount', value);
  }

  public async setReceiver(value: string): Promise<void> {
    await this.receiverCard.setValueForTextbox('Account Name', value);
  }
  public async setSenderChainId(value: string): Promise<void> {
    const regExp = new RegExp(`${value} \\(\\d{0,4}(\\.|\\,)\\d{0,4} KDA\\)`);
    await this.senderCard.setValueForListBox(
      'Select Chain ID',
      'Select Chain ID Chain ID',
      regExp,
    );
  }

  public async setReceiverChainId(
    value: string,
    newOrExisting: 'new' | 'existing',
  ): Promise<void> {
    await this.receiverCard.setValueForListBox(
      'Select Chain ID',
      'Select Chain ID Chain ID',
      `${value} (${newOrExisting})`,
    );
  }

  public async setReceiverTab(value: 'existing' | 'new'): Promise<void> {
    await this.receiverCard.setTab(value);
  }

  public async setPublicKey(
    value: string,
    newOrExisting: 'new' | 'existing',
  ): Promise<void> {
    if (newOrExisting === 'new') {
      const account = await generateAccount(1, ['0']);
      await this.receiverCard.setValueForTextbox(
        'Enter Public Key',
        account.keys[0].publicKey,
      );
      await this.receiverCard.clickButton('Add public key');
    } else if (newOrExisting === 'existing') {
      await this.receiverCard.setValueForTextbox('Account Name', `k:${value}`);
    }
  }

  public async signTransaction(): Promise<void> {
    await this._page.getByRole('button', { name: 'Sign' }).click();
  }

  public async transfer(): Promise<void> {
    await this._page
      .locator('section') // Todo Find a better way to scope this
      .getByRole('button', { name: 'Transfer', exact: true })
      .click();
  }
}
