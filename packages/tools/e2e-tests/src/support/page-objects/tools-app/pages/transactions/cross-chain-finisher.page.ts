import { expect, type Page } from '@playwright/test';
import { CardComponent } from '../../../react-ui/card.component';
import { AsideComponent } from '../../components/aside.component';
import { ProgressBarComponent } from '../../components/progressBar.component';
import { TrackerCardComponent } from '../../components/trackerCard.component';

export class CrossChainFinisherPage {
  private readonly _page: Page;
  public aside: AsideComponent;
  public searchRequestCard: CardComponent;
  public senderCard: TrackerCardComponent;
  public receiverCard: TrackerCardComponent;
  public progressBar: ProgressBarComponent;
  public gasSettingsCard: CardComponent;

  public constructor(page: Page) {
    this._page = page;
    this.aside = new AsideComponent(this._page);
    this.searchRequestCard = new CardComponent(this._page, 'Search Request');
    this.senderCard = new TrackerCardComponent(this._page, 'Sender');
    this.receiverCard = new TrackerCardComponent(this._page, 'Receiver');
    this.progressBar = new ProgressBarComponent(this._page);
    this.gasSettingsCard = new CardComponent(this._page, 'Gas Settings');
  }

  public async finishTransaction(): Promise<void> {
    await this._waitForTxInfo();
    await this._page
      .getByRole('button', { name: 'Finish Transaction' })
      .click();
  }

  private async _waitForTxInfo(): Promise<void> {
    await expect(this._page.locator('h5:text-is("Overview")')).toBeVisible();
    await expect(
      this._page.locator('h5:text-is("Gas Settings")'),
    ).toBeVisible();
    await expect(this._page.locator('h5:text-is("SigData")')).toBeVisible();
  }
}
