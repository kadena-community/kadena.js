import { CardComponent } from '@page-objects/react-ui/card.component';
import { ProgressBarComponent } from '@page-objects/tools-app/components/progressBar.component';
import { TrackerCardComponent } from '@page-objects/tools-app/components/trackerCard.component';
import type { Locator, Page } from '@playwright/test';

export class CrossChainTrackerPage {
  private readonly _page: Page;
  public searchRequestCard: CardComponent;
  public senderCard: TrackerCardComponent;
  public receiverCard: TrackerCardComponent;
  public progressBar: ProgressBarComponent;
  public page: Locator;

  public constructor(page: Page) {
    this._page = page;
    this.page = this._page.locator('h4:text-is("Finish transaction")');
    this.searchRequestCard = new CardComponent(this._page, 'Search Request');
    this.senderCard = new TrackerCardComponent(this._page, 'Sender');
    this.receiverCard = new TrackerCardComponent(this._page, 'Receiver');
    this.progressBar = new ProgressBarComponent(this._page);
  }

  public async searchForTransaction(txHash: string): Promise<void> {
    await this.searchRequestCard.setValueForTextbox('Request Key', txHash);
    await this._page.getByRole('button', { name: 'Search' }).click();
  }

  public async navToFinishTransaction(): Promise<void> {
    await this._page
      .getByRole('button', { name: 'Finish Transaction' })
      .click();
  }
}
