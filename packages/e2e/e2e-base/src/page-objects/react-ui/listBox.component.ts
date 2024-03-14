import type { Locator, Page } from '@playwright/test';

export class ListBoxComponent {
  private readonly _page: Page;
  private _parentLocator: Locator;

  public constructor(page: Page, parentLocator: Locator) {
    this._page = page;
    this._parentLocator = parentLocator;
  }

  public async setValueForListBox(
    btnLabel: string,
    listLabel: string,
    value: string | RegExp,
  ): Promise<void> {
    await this._parentLocator.getByRole('button', { name: btnLabel }).click();
    await this._page
      .getByRole('listbox', { name: listLabel })
      .getByRole('option', { name: value, exact: true })
      .click();
  }
}
