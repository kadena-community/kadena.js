import type { Locator, Page } from '@playwright/test';

export default class CardComponent {
  private readonly _page: Page;
  private _componentLocator: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._componentLocator = this._page.getByTestId('kda-card');
  }

  public async setValueForTextbox(label: string, value: string): Promise<void> {
    await this._page.getByRole('textbox', { name: label }).fill(value);
  }

  public async setValueForCombobox(
    label: string,
    value: string,
  ): Promise<void> {
    await this._page.getByRole('combobox', { name: label }).selectOption(value);
  }

  public async clickButton(label: string): Promise<void> {
    await this._page.getByRole('button', { name: label }).click();
  }
}
