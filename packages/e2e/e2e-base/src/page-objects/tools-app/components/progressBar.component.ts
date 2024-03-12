import type { Locator, Page } from '@playwright/test';
import { getI18nInstance } from 'playwright-i18next-fixture';

export class ProgressBarComponent {
  private readonly _i18n = getI18nInstance();
  private _page: Page;
  private _component: Locator;
  private _checkpointOne: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._component = this._page.locator(`[data-testid="kda-progress-bar"]`);
    this._checkpointOne = this._component.locator(
      '[data-testid="kda-checkpoint-container-0"]',
    );
  }

  public async getCheckpoint(index: number): Promise<Locator> {
    return this._component.locator(
      `[data-testid="kda-checkpoint-container-${index}"]`,
    );
  }

  public async getCheckpointStatus(index: number): Promise<Locator> {
    return this._component
      .locator(`[data-testid="kda-checkpoint-container-${index}"]`)
      .locator('[data-testid="kda-status-indicator"]');
  }
}
