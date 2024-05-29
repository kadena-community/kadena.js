import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ListBoxComponent } from '../../../react-ui/listBox.component';

export class FundExistingAccountPage {
  private readonly _page: Page;
  private _chainId: ListBoxComponent;
  private _accountNameInput: Locator;
  private _fundAccount: Locator;

  public constructor(page: Page) {
    this._page = page;
    //this._accountCard = new CardComponent(this._page, 'Account');
    this._chainId = new ListBoxComponent(
      this._page,
      'Select Chain ID',
      'Select Chain ID Chain ID',
    );
    this._accountNameInput = this._page.getByRole('textbox', {
      name: 'The account name to fund coins to',
    });
    this._fundAccount = this._page.getByRole('button', {
      name: 'Fund 20 Coins',
    });
  }

  public async fundExistingAccount(
    account: string,
    chainId: string,
  ): Promise<void> {
    await this._chainId.setValue(chainId);
    await this._accountNameInput.fill(account);
    await expect(this._accountNameInput).toHaveValue(account);
    await this._fundAccount.click();
  }
}
