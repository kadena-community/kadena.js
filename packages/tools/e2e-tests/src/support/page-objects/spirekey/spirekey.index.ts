import type { Page } from '@playwright/test';
import { AccountsPage } from './pages/accounts.page';
import { RegisterPage } from './pages/register.page';
import { WelcomePage } from './pages/welcome.page';

export class SpirekeyAppIndex {
  public readonly page: Page;
  public welcomePage: WelcomePage;
  public registerPage: RegisterPage;
  public accountPage: AccountsPage;

  public constructor(page: Page) {
    this.page = page;
    this.welcomePage = new WelcomePage(this.page);
    this.registerPage = new RegisterPage(this.page);
    this.accountPage = new AccountsPage(this.page);
  }
}
