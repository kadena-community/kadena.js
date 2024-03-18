import type { Locator, Page } from '@playwright/test';
import { ListBoxComponent } from './listBox.component';

export class CardComponent {
  private readonly _page: Page;
  private _listbox: ListBoxComponent;
  private _component: Locator;

  public constructor(page: Page, heading: string) {
    this._page = page;
    this._component = this._page
      .locator('_react=Card')
      .filter({ has: this._page.getByRole('heading', { name: heading }) });
    this._listbox = new ListBoxComponent(this._page, this._component);
  }

  public async setValueForTextbox(label: string, value: string): Promise<void> {
    await this._component.getByRole('textbox', { name: label }).fill(value);
    //await this._page.getByRole('textbox', { name: label }).press('Tab');
  }

  public async setValueForCombobox(name: string, value: string): Promise<void> {
    await this._component
      .getByRole('combobox', { name: name })
      .selectOption(value);
  }

  public async setValueForListBox(
    btnLabel: string,
    listLabel: string,
    value: string | RegExp,
  ): Promise<void> {
    await this._listbox.setValueForListBox(btnLabel, listLabel, value);
  }

  public async setTab(value: string): Promise<void> {
    await this._component.getByRole('tab', { name: value }).click();
  }

  public async clickButton(label: string): Promise<void> {
    await this._component.getByRole('button', { name: label }).click();
  }
}
