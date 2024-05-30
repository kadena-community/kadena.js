import type { Locator, Page } from '@playwright/test';
import { ProgressBarComponent } from '../../../tools-app/components/progressBar.component';
import { TrackerCardComponent } from '../../../tools-app/components/trackerCard.component';

export class CrossChainTrackerPage {
  private readonly _page: Page;
  public senderCard: TrackerCardComponent;
  public receiverCard: TrackerCardComponent;
  public progressBar: ProgressBarComponent;
  public page: Locator;
  private _txInput: Locator;
  private _searchBtn: Locator;
  private _finishTxBtn: Locator;

  public constructor(page: Page) {
    this._page = page;
    this.page = this._page.locator('h4:text-is("Finish transaction")');
    this._txInput = this._page.getByRole('textbox', { name: 'Request Key' });
    this._searchBtn = this._page.getByRole('button', { name: 'Search' });
    this._finishTxBtn = this._page.getByRole('button', {
      name: 'Finish Transaction',
    });
    this.senderCard = new TrackerCardComponent(this._page, 'Sender');
    this.receiverCard = new TrackerCardComponent(this._page, 'Receiver');
    this.progressBar = new ProgressBarComponent(this._page);
  }

  public async searchForTransaction(txHash: string): Promise<void> {
    await this._txInput.fill(txHash);
    await this._searchBtn.click();
  }

  public async navToFinishTransaction(): Promise<void> {
    await this._finishTxBtn.click();
  }
}
