import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export default class MenuHelper {
  private readonly _page: Page;
  private _levelTwo: Locator;
  private _levelOne: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._levelOne = this._page.locator(
      '[data-cy="sidemenu-submenu"] [data-testid="menuItem-1"] > button',
    );
    this._levelTwo = this._page.locator(
      '[data-cy="sidemenu-submenu"] [data-testid="menuItem-2"] > button',
    );
  }

  public async openCollapsedItems(): Promise<void> {
    const collapsedFirstLevelElements = await this._levelOne.all();

    for (const collapsedElement of collapsedFirstLevelElements) {
      await collapsedElement.click();
      await this._page.waitForTimeout(1000);
      await expect(collapsedElement).toHaveAttribute('data-active', 'true');
    }
    const collapsedSecondLevelElements = await this._levelTwo.all();
    for (const collapsedElement of collapsedSecondLevelElements) {
      await collapsedElement.click();
      await expect(collapsedElement).toHaveAttribute('data-active', 'true');
    }
  }
}
