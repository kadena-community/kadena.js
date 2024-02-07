import type { Locator, Page } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';

export class TrackerCardComponent {
  private readonly _i18n = getI18nInstance();
  private _page: Page;
  private _component: Locator;
  private _account: Locator;
  private _maskIcon: Locator;
  private _chain: Locator;

  public constructor(page: Page, title: string) {
    this._page = page;
    this._component = this._page.locator(
      `[data-testId="kda-data-container"]:has-text("${title}")`,
    );
    this._account = this._component.locator('[data-testid="kda-masked-value"]');
    this._maskIcon = this._component.locator('svg');
    this._chain = this._component.locator('div:text-is("Chain") + div');
  }

  public async toggleMasking(): Promise<void> {
    await this._maskIcon.click();
  }

  public async getAccount(): Promise<Locator> {
    return this._account;
  }

  public async getChain(): Promise<Locator> {
    return this._chain;
  }
}
