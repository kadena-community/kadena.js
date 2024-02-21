import type { Page } from '@playwright/test';
import { HomePage } from './pages/home.page';

export class PouAppIndex {
  public readonly page: Page;
  public homePage: HomePage;

  public constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(this.page);
  }
}
