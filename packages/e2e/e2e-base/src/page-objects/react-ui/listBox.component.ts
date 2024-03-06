import type { Page } from '@playwright/test';

export class ListBoxComponent {
  private readonly _page: Page;

  public constructor(page: Page) {
    this._page = page;
  }

  public async setValueForListBox(
    btnLabel: string,
    listLabel: string,
    value: string,
  ): Promise<void> {
    await this._page.getByRole('button', { name: btnLabel }).click();
    await this._page
      .getByRole('listbox', { name: listLabel })
      .getByRole('option', { name: value, exact: true })
      .click();
  }
}
