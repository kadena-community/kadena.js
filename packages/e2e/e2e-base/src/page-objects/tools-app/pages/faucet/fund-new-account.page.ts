import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { IAccount } from '../../../../types/account.types';
import { ListBoxComponent } from '../../../kode-ui/listBox.component';
export class FundNewAccountPage {
  private readonly _page: Page;
  private _publicKey: Locator;
  private _addPubKey: Locator;
  private _chainId: ListBoxComponent;
  private _accountNameInput: Locator;
  private _createAndFundBtn: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._publicKey = this._page.getByRole('textbox', { name: 'Public Key' });
    this._addPubKey = this._page.getByRole('button', {
      name: 'Add Public Key',
    });
    this._chainId = new ListBoxComponent(
      this._page,
      'Select Chain ID',
      'Select Chain ID Chain ID',
    );
    this._accountNameInput = this._page.getByRole('textbox', {
      name: 'The account name to fund coins to',
    });
    this._createAndFundBtn = this._page.getByRole('button', {
      name: 'Create and Fund Account',
    });
  }

  public async CreateFundAccount(account: IAccount): Promise<void> {
    for (const keyPair of account.keys) {
      await this._publicKey.fill(keyPair.publicKey);
      await this._addPubKey.click();
    }
    await this._chainId.setValue(account.chains[0]);
    //Form validation is retriggered after setting the chain. Explicitly wait for the Account Name to be visible before pressing fund.
    await expect(this._accountNameInput).toHaveValue(account.account);
    await this._createAndFundBtn.click();
  }
}
