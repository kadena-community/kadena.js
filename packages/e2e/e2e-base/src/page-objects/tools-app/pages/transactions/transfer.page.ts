import { CardComponent } from '@page-objects/react-ui/card.component';
import type { Page } from '@playwright/test';

export class TransferPage {
  private readonly _page: Page;
  public senderCard: CardComponent;
  public receiverCard: CardComponent;

  public constructor(page: Page) {
    this._page = page;
    this.senderCard = new CardComponent(this._page, 'Sender');
    this.receiverCard = new CardComponent(this._page, 'Receiver');
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

  public async setChainId(
    forAccount: 'sender' | 'receiver',
    value: string,
  ): Promise<void> {
    let card: CardComponent;
    switch (forAccount) {
      case 'sender':
        card = this.senderCard;
        break;
      case 'receiver':
        card = this.receiverCard;
        break;
    }

    await card.setValueForListBox(
      'Select Chain ID',
      'Select Chain ID Chain ID',
      value,
    );
  }

  public async setReceiverTab(value: 'Existing' | 'New'): Promise<void> {
    await this.receiverCard.setTab(value);
  }

  public async setPublicKey(value: string): Promise<void> {
    await this.receiverCard.setValueForTextbox('Enter Public Key', value);
    await this.receiverCard.clickButton('Add public key');
  }

  public async signTransaction(): Promise<void> {
    await this._page.getByRole('button', { name: 'Sign' }).click();
  }
}
