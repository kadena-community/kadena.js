import type { Page } from '@playwright/test';
import { NavHeaderComponent } from '../react-ui/navHeader.component';
import { AsideComponent } from './components/aside.component';
import { FundExistingAccountPage } from './pages/faucet/fund-existing-account.page';
import { FundNewAccountPage } from './pages/faucet/fund-new-account.page';
import { HomePage } from './pages/home.page';
import { TransactionsPage } from './pages/transactions.page';

export class ToolsAppIndex {
  private readonly _page: Page;
  public navHeader: NavHeaderComponent;
  public asidePanel: AsideComponent;
  public homePage: HomePage;
  public fundNewAccountPage: FundNewAccountPage;
  public fundExistingAccountPage: FundExistingAccountPage;
  public transactionsPage: TransactionsPage;

  public constructor(page: Page) {
    this._page = page;
    this.navHeader = new NavHeaderComponent(this._page);
    this.asidePanel = new AsideComponent(this._page);
    this.homePage = new HomePage(this._page);
    this.fundNewAccountPage = new FundNewAccountPage(this._page);
    this.fundExistingAccountPage = new FundExistingAccountPage(this._page);
    this.transactionsPage = new TransactionsPage(this._page);
  }
}
