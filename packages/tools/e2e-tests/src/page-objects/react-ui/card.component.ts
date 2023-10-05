import type { Locator, Page } from '@playwright/test';

export default class CardComponent {
  private readonly _page: Page;
  private _componentLocator: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._componentLocator = this._page.getByTestId("kda-card");
  }

  async setValueForInput(label: string, value: string): Promise<void> {
    await this._page.getByRole('textbox', {name: label}).fill(value)
  }

  async clickButton(label: string): Promise<void> {
    await this._page.getByRole('button', {name: label}).click()
  }

}
