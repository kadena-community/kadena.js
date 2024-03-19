import { NavHeaderComponent } from '@page-objects/react-ui/navHeader.component';
import { AsideComponent } from '@page-objects/tools-app/components/aside.component';
import { FundExistingAccountPage } from '@page-objects/tools-app/pages/faucet/fund-existing-account.page';
import { FundNewAccountPage } from '@page-objects/tools-app/pages/faucet/fund-new-account.page';
import { HomePage } from '@page-objects/tools-app/pages/home.page';
import { CrossChainFinisherPage } from '@page-objects/tools-app/pages/transactions/cross-chain-finisher.page';
import { CrossChainTrackerPage } from '@page-objects/tools-app/pages/transactions/cross-chain-tracker.page';
import type { Page } from '@playwright/test';
import { TransferPage } from './pages/transactions/transfer.page';

export class ToolsAppIndex {
  private readonly _page: Page;
  public navHeader: NavHeaderComponent;
  public asidePanel: AsideComponent;
  public homePage: HomePage;
  public fundNewAccountPage: FundNewAccountPage;
  public fundExistingAccountPage: FundExistingAccountPage;
  public crossChainTrackerPage: CrossChainTrackerPage;
  public crossChainFinisherPage: CrossChainFinisherPage;
  public transferPage: TransferPage;

  public constructor(page: Page) {
    this._page = page;
    this.navHeader = new NavHeaderComponent(this._page);
    this.asidePanel = new AsideComponent(this._page);
    this.homePage = new HomePage(this._page);
    this.fundNewAccountPage = new FundNewAccountPage(this._page);
    this.fundExistingAccountPage = new FundExistingAccountPage(this._page);
    this.crossChainTrackerPage = new CrossChainTrackerPage(this._page);
    this.crossChainFinisherPage = new CrossChainFinisherPage(this._page);
    this.transferPage = new TransferPage(this._page);
  }
}
