import { CardComponent } from '@page-objects/react-ui/card.component';
import { NotificationContainerComponent } from '@page-objects/react-ui/notificationContainer.component';
import { AsideComponent } from '@page-objects/tools-app/components/aside.component';
import { ProgressBarComponent } from '@page-objects/tools-app/components/progressBar.component';
import { TrackerCardComponent } from '@page-objects/tools-app/components/trackerCard.component';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class CrossChainFinisherPage {
  private readonly _page: Page;
  public aside: AsideComponent;
  public searchRequestCard: CardComponent;
  public senderCard: TrackerCardComponent;
  public receiverCard: TrackerCardComponent;
  public progressBar: ProgressBarComponent;
  public gasSettingsCard: CardComponent;
  public notificationComponent: NotificationContainerComponent;

  public constructor(page: Page) {
    this._page = page;
    this.aside = new AsideComponent(this._page);
    this.searchRequestCard = new CardComponent(this._page, 'Search Request');
    this.senderCard = new TrackerCardComponent(this._page, 'Sender');
    this.receiverCard = new TrackerCardComponent(this._page, 'Receiver');
    this.progressBar = new ProgressBarComponent(this._page);
    this.gasSettingsCard = new CardComponent(this._page, 'Gas Settings');
    this.notificationComponent = new NotificationContainerComponent(this._page);
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
