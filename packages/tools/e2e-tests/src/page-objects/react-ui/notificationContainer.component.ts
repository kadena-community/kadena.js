import type { Locator, Page } from '@playwright/test';

export class NotificationContainerComponent {
  private readonly _page: Page;
  public container: Locator;

  public constructor(page: Page) {
    this._page = page;
    this.container = this._page.getByRole('status')
  }

  public async getTitle(): Promise<Locator> {
    return this.container.getByRole('heading');
  }

  public async close(): Promise<void> {
    await this.container
      .getByRole('button', { name: 'Close Notification' })
      .click();
  }
}
