import type { Locator, Page } from '@playwright/test';

export default class NotificationContainerComponent {
  private readonly _page: Page;
  private _componentLocator: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._componentLocator = this._page.getByRole("alert");
  }

  async getTitle(): Promise<Locator> {
    return this._componentLocator.getByRole('heading')
  }

  async getMessage(): Promise<Locator> {
    return this._componentLocator.getByRole('generic')
  }

  async close(): Promise<void> {
    await this._page.getByRole('button', {name: 'Close Notification'}).click()
  }

}
