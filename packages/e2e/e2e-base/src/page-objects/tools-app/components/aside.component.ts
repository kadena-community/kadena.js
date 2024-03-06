import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class AsideComponent {
  private _page: Page;
  private _component: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._component = this._page.locator('aside');
  }

  public async navigateTo(ariaLabel: string): Promise<void> {
    await this._component.getByRole('link', { name: ariaLabel }).click();
    await expect(
      this._page
        .getByRole('navigation', { name: 'Breadcrumbs' })
        .locator(`a:text-is("${ariaLabel}")`),
    ).toBeVisible();
  }
}
