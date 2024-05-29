import type { Page } from '@playwright/test';

export class ListBoxComponent {
  private readonly _page: Page;
  private _button: string;
  private _listLabel: string;

  public constructor(page: Page, button: string, listLabel: string) {
    this._page = page;
    this._button = button;
    this._listLabel = listLabel;
  }

  /**
   * The default function to use a listbox.
   * @param value
   */
  public async setValue(value: string | RegExp): Promise<void> {
    await this._page.getByRole('button', { name: this._button }).click();
    await this._page
      .getByRole('listbox', { name: this._listLabel })
      .getByRole('option', { name: value, exact: true })
      .click();
  }

  /**
   * The function to use a listbox by test id. This is primiarly used when a listbox is present multiple times
   * @param value
   */
  public async setValueByTestId(value: string | RegExp): Promise<void> {
    await this._page.getByTestId(this._button).click();
    await this._page
      .getByRole('listbox', { name: this._listLabel })
      .getByRole('option', { name: value, exact: true })
      .click();
  }
}
