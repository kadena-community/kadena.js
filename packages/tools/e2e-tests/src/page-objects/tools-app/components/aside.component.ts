import type { Page } from '@playwright/test';

export class AsideComponent {
  private _page: Page;

  public constructor(page: Page) {
    this._page = page;
  }

  public async navigateTo(ariaLabel: string): Promise<void> {
    await this._page.getByRole('button', { name: ariaLabel }).click();
  }
}
