import type { Locator, Page } from '@playwright/test';
import { generateAccount } from '../../../../helpers/client-utils/accounts.helper';
import { ListBoxComponent } from '../../../react-ui/listBox.component';

export class TransferPage {
  private readonly _page: Page;
  private _fromDevice: ListBoxComponent;
  private _keyIndex: Locator;
  private _amount: Locator;
  private _accountName: Locator;
  private _connectLedgerBtn: Locator;
  private _signOnLedger: Locator;
  private _senderChainId: ListBoxComponent;
  private _receiverChainId: ListBoxComponent;
  private _receiverPubKey: Locator;
  private _addPubKeyBtn: Locator;
  private _receiverAccount: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._fromDevice = new ListBoxComponent(this._page, 'Ledger From', 'From');
    this._keyIndex = this._page.getByRole('textbox', {
      name: 'Ledger Key Index',
    });
    this._amount = this._page.getByRole('textbox', { name: 'Amount' });
    this._accountName = this._page.getByRole('textbox', {
      name: 'Account Name',
    });
    this._connectLedgerBtn = this._page.getByRole('button', {
      name: 'Connect Ledger',
    });
    this._signOnLedger = this._page.getByRole('button', {
      name: 'Sign on Ledger',
      exact: true,
    });
    this._senderChainId = new ListBoxComponent(
      this._page,
      'senderChainId',
      'Select Chain ID Chain ID',
    );
    this._receiverChainId = new ListBoxComponent(
      this._page,
      'receiverChainId',
      'Select Chain ID Chain ID',
    );
    this._receiverPubKey = this._page.getByRole('textbox', {
      name: 'Enter Public Key',
    });
    this._addPubKeyBtn = this._page.getByRole('button', {
      name: 'Add public key',
    });
    this._receiverAccount = this._page.locator('#receiver-account-name');
  }

  public async setSender(valueToSelect = 'Ledger'): Promise<void> {
    await this._fromDevice.setValue(valueToSelect);
  }

  public async setKeyIndex(value: string): Promise<void> {
    await this._keyIndex.fill(value);
  }

  public async setAmount(value: string): Promise<void> {
    await this._amount.fill(value);
  }

  public async setReceiver(value: string): Promise<void> {
    await this._accountName.fill(value);
  }

  public async setSenderChainId(value: string): Promise<void> {
    const regExp = new RegExp(`${value} \\(\\d{0,4}(\\.|\\,)\\d{0,4} KDA\\)`);
    await this._senderChainId.setValueByTestId(regExp);
  }

  public async setReceiverChainId(
    value: string,
    newOrExisting: 'new' | 'existing',
  ): Promise<void> {
    await this._receiverChainId.setValueByTestId(`${value} (${newOrExisting})`);
  }

  public async setReceiverTab(value: 'existing' | 'new'): Promise<void> {
    await this._page.getByRole('tab', { name: value }).click();
  }

  public async setPublicKey(
    value: string,
    newOrExisting: 'new' | 'existing',
  ): Promise<void> {
    if (newOrExisting === 'new') {
      const account = await generateAccount(1, ['0']);
      await this._receiverPubKey.fill(account.keys[0].publicKey);
      await this._addPubKeyBtn.click();
    } else if (newOrExisting === 'existing') {
      await this._receiverAccount.fill(`k:${value}`);
    }
  }

  public async signTransaction(): Promise<void> {
    await this._signOnLedger.click();
  }

  public async connectLedger(): Promise<void> {
    await this._connectLedgerBtn.click();
  }

  public async transfer(): Promise<void> {
    await this._page
      .locator('section') // Todo Find a better way to scope this
      .getByRole('button', { name: 'Transfer', exact: true })
      .click();
  }
}
