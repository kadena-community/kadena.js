import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export default class CookieHelper {
  private readonly page: Page;
  consentBar: Locator;
  acceptButton: any;

  constructor(page: Page) {
    this.page = page;
    this.consentBar = this.page.getByRole('region', { name: 'Cookie Consent' });
    this.acceptButton = this.consentBar.getByRole('button', { name: 'Accept' });
  }

  async acceptCookies() {
    await this.acceptButton.click();
  }
}
