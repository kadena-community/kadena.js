import type { Locator, Page } from '@playwright/test';
import { ListBoxComponent } from './listBox.component';

export class CardComponent {
  private readonly _page: Page;
  public _chain: ListBoxComponent;
  private _component: Locator;

  public constructor(page: Page, title: string) {
    this._page = page;
    this._component = this._page.locator(`div h5:has-text("${title}")`);
    this._chain = new ListBoxComponent(this._page);
  }

  public async setValueForTextbox(label: string, value: string): Promise<void> {
    await this._page.getByRole('textbox', { name: label }).fill(value);
    await this._page.getByRole('textbox', { name: label }).press('Tab');
  }

  public async setValueForCombobox(name: string, value: string): Promise<void> {
    await this._page.getByRole('combobox', { name: name }).selectOption(value);
  }

  public async clickButton(label: string): Promise<void> {
    await this._page.getByRole('button', { name: label }).click();
  }
}
