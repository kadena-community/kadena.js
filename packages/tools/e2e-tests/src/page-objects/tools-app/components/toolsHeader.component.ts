import CardComponent from '../../react-ui/card.component';
import NavHeaderComponent from '../../react-ui/navHeader.component';

import type { Locator, Page } from '@playwright/test';

export default class ToolsHeaderComponent extends NavHeaderComponent {
  public networkCard: CardComponent;

  public constructor(page: Page) {
    super(page);
    this._page = page;
    this.networkCard = new CardComponent(page);
  }

  public async setNetwork(networkLabel: string): Promise<string[]> {
    return this._component.getByRole('combobox').selectOption(networkLabel);
  }

  public async getNetwork(): Promise<Locator> {
    return this._component.getByRole('combobox');
  }
  public async addNetwork(
    networkLabel: string,
    chainId: string,
    host: string,
  ): Promise<void> {
    await this._page.getByRole('combobox').selectOption('+ add network');
    await this.networkCard.setValueForTextbox('Network Label', networkLabel);
    await this.networkCard.setValueForTextbox('Network ID', chainId);
    await this.networkCard.setValueForTextbox('Network Api', host);
    await this.networkCard.clickButton('Save Network');
  }
}
