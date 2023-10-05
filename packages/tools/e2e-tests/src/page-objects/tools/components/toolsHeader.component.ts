import type { Locator, Page } from '@playwright/test';
import CardComponent from '../../react-ui/card.component';
import NavHeaderComponent from '../../react-ui/navHeader.component';

export default class ToolsHeaderComponent extends NavHeaderComponent {
  public networkCard: CardComponent;

  constructor(page: Page) {
    super(page)
    this.networkCard = new CardComponent(page)
  }

   public async setNetwork(networkLabel: string): Promise<string[]> {
    return this._componentLocator.getByRole('combobox').selectOption(networkLabel);
  }

  public async getNetwork(): Promise<Locator> {
    return this._componentLocator.getByRole('combobox').locator('option[selected]')
  }
  public async addNetwork(networkLabel: string, chainId: string, host: string) {
    await this._componentLocator.getByRole('combobox').selectOption("+ add network");
    await this.networkCard.setValueForInput('Network Label', networkLabel);
    await this.networkCard.setValueForInput('Network ID', chainId);
    await this.networkCard.setValueForInput('Network Api', host);
    await this.networkCard.clickButton('Save Network');
  }

}
