import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export default class MenuHelper {
  private readonly page: Page;
  private levelTwo: Locator;
  private levelOne: Locator;

  constructor(page: Page) {
    this.page = page;
    this.levelOne = this.page.locator('[data-cy="sidemenu-submenu"] [test-id="menuItem-1"] > button')
    this.levelTwo = this.page.locator('[data-cy="sidemenu-submenu"] [test-id="menuItem-2"] > button')
  }

  async openCollapsedItems(): Promise<void> {
    const collapsedFirstLevelElements = await this.levelOne.all();

    for (const collapsedElement of collapsedFirstLevelElements) {
      await collapsedElement.click();
      await this.page.waitForTimeout(1000)
      expect(collapsedElement).toHaveAttribute('data-active', "true")
    }
    const collapsedSecondLevelElements = await this.levelTwo.all();
    for (const collapsedElement of collapsedSecondLevelElements) {
      await collapsedElement.click();
      expect(collapsedElement).toHaveAttribute('data-active', "true")
    }
  }
}
