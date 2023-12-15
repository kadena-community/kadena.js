import type { Locator, Page } from '@playwright/test';

export class AsideComponent {
  private _page: Page;
  private _component: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._component =this._page.locator('aside')
  }

  public async clickPageLink(ariaLabel: string): Promise<void> {
    await this._component.getByRole('link', { name: ariaLabel }).click();
  }
}
