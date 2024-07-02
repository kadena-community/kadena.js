import type { Page } from '@playwright/test';
import { NotificationContainerComponent } from '../kode-ui/notificationContainer.component';
import { AsideComponent } from '../tools-app/components/aside.component';
import { FundExistingAccountPage } from '../tools-app/pages/faucet/fund-existing-account.page';
import { FundNewAccountPage } from '../tools-app/pages/faucet/fund-new-account.page';
import { CrossChainFinisherPage } from '../tools-app/pages/transactions/cross-chain-finisher.page';
import { CrossChainTrackerPage } from '../tools-app/pages/transactions/cross-chain-tracker.page';
import { ToolsHeaderComponent } from './components/toolsHeader.component';
import { TransferPage } from './pages/transactions/transfer.page';

export class ToolsAppIndex {
  private readonly _page: Page;

  public asidePanel: AsideComponent;
  public fundNewAccountPage: FundNewAccountPage;
  public fundExistingAccountPage: FundExistingAccountPage;
  public crossChainTrackerPage: CrossChainTrackerPage;
  public crossChainFinisherPage: CrossChainFinisherPage;
  public transferPage: TransferPage;
  public txProcessingNotification: NotificationContainerComponent;
  public txFinishedNotifcation: NotificationContainerComponent;
  public header: ToolsHeaderComponent;

  public constructor(page: Page) {
    this._page = page;
    this.header = new ToolsHeaderComponent(this._page);
    this.asidePanel = new AsideComponent(this._page);
    this.fundNewAccountPage = new FundNewAccountPage(this._page);
    this.fundExistingAccountPage = new FundExistingAccountPage(this._page);
    this.crossChainTrackerPage = new CrossChainTrackerPage(this._page);
    this.crossChainFinisherPage = new CrossChainFinisherPage(this._page);
    this.transferPage = new TransferPage(this._page);

    this.txProcessingNotification = new NotificationContainerComponent(
      this._page,
      'Transaction is being processed...',
    );
    this.txFinishedNotifcation = new NotificationContainerComponent(
      this._page,
      'Transaction successfully completed',
    );
  }
}
