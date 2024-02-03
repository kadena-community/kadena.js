import type { Locator, Page } from '@playwright/test';

export class NotificationContainerComponent {
  private readonly _page: Page;
  public container: Locator;

  public constructor(page: Page, title: string) {
    this._page = page;
    this.container = this._page.locator('[role="status"]', {
      has: this._page.locator(`div h5:text-is("${title}")`),
    });
  }

  public async getComponent(): Promise<Locator> {
    return this.container;
  }

  public async close(): Promise<void> {
    await this.container
      .getByRole('button', { name: 'Close Notification' })
      .click();
  }
}

//page.locator('div', { has: page.locator('text="Playwright"') })
