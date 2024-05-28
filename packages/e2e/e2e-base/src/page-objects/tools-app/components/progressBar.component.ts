import type { Locator, Page } from '@playwright/test';

export class ProgressBarComponent {
  private _page: Page;
  private _component: Locator;

  public constructor(page: Page) {
    this._page = page;
    this._component = this._page.locator(`[data-testid="kda-progress-bar"]`);
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
