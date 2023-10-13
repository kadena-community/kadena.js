import type { Locator, Page } from '@playwright/test';

export default class NotificationContainerComponent {
  private readonly _page: Page;

  public constructor(page: Page) {
    this._page = page;
  }

  public async getTitle(): Promise<Locator> {
    return this._page.getByRole('heading');
  }

  public async close(): Promise<void> {
    await this._page
      .getByRole('button', { name: 'Close Notification' })
      .click();
  }
}
