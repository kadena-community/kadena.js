import { AccountPage } from './pages/account.page';
import { FaucetPage } from './pages/faucet.page';
import { HomePage } from './pages/home.page';
import { ModuleExplorerPage } from './pages/moduleExplorer.page';
import { TransactionsPage } from './pages/transactions.page';

import type { Page } from '@playwright/test';

export class ToolsAppIndex {
  private readonly _page: Page;
  public homePage: HomePage;
  public faucetPage: FaucetPage;
  public transactionsPage: TransactionsPage;
  public accountPage: AccountPage;
  public moduleExplorerPage: ModuleExplorerPage;

  public constructor(page: Page) {
    this._page = page;
    this.homePage = new HomePage(this._page);
    this.faucetPage = new FaucetPage(this._page);
    this.transactionsPage = new TransactionsPage(this._page);
    this.accountPage = new AccountPage(this._page);
    this.moduleExplorerPage = new ModuleExplorerPage(this._page);
  }
}
