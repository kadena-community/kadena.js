import type { Page } from '@playwright/test';
import { devnetGasStaton } from '../../../constants/accounts.constants';
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

  public async searchForTransaction(txHash: string): Promise<void> {
    await this.searchRequestCard.setValueForTextbox('Request Key', txHash);
    await this._page.getByRole('button', { name: 'Search' }).click();
    await this.waitForOverview();
  }

  public async finishTransaction(txHash: string): Promise<void> {
    await this.searchRequestCard.setValueForTextbox('Request Key', txHash);
    await await this.waitForOverview();
    await this.setGasSettings();
    await this._page
      .getByRole('button', { name: 'Finish Transaction' })
      .click();
  }

  public async setGasSettings(): Promise<void> {
    await this.gasSettingsCard.setValueForTextbox('Gas Payer', devnetGasStaton);
  }

  public async waitForPageLoad(): Promise<void> {
    await this._page.waitForSelector('h4:text-is("Finish transaction")');
  }

  public async waitForOverview(): Promise<void> {
    await this._page.waitForSelector('h5:text-is("Overview")');
  }
}
