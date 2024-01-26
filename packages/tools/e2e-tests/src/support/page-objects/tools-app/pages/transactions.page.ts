import type { Page } from '@playwright/test';
import { CardComponent } from '../../react-ui/card.component';
import { AsideComponent } from '../components/aside.component';
import { ProgressBarComponent } from '../components/progressBar.component';
import { TrackerCardComponent } from '../components/trackerCard.component';

export class TransactionsPage {
  private readonly _page: Page;
  public aside: AsideComponent;
  public searchRequestCard: CardComponent;
  public senderCard: TrackerCardComponent;
  public receiverCard: TrackerCardComponent;
  public progressBar: ProgressBarComponent;

  public constructor(page: Page) {
    this._page = page;
    this.aside = new AsideComponent(this._page);
    this.searchRequestCard = new CardComponent(this._page);
    this.senderCard = new TrackerCardComponent(this._page, 'Sender');
    this.receiverCard = new TrackerCardComponent(this._page, 'Receiver');
    this.progressBar = new ProgressBarComponent(this._page);
  }

  public async searchForTransaction(txHash: string): Promise<void> {
    await this.searchRequestCard.setValueForTextbox('Request Key', txHash);
    await this._page.getByRole('button', { name: 'Search' }).click();
  }
}
