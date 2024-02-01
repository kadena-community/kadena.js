import type { Page } from '@playwright/test';
import { ListBoxComponent } from './listBox.component';

export class CardComponent {
  private readonly _page: Page;
  public _chain: ListBoxComponent;

  public constructor(page: Page) {
    this._page = page;
    this._chain = new ListBoxComponent(this._page);
  }

  public async setValueForTextbox(label: string, value: string): Promise<void> {
    await this._page.getByRole('textbox', { name: label }).fill(value);
  }

  public async setValueForCombobox(name: string, value: string): Promise<void> {
    await this._page.getByRole('combobox', { name: name }).selectOption(value);
  }

  public async clickButton(label: string): Promise<void> {
    await this._page.getByRole('button', { name: label }).click();
  }
}
