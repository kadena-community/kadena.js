import {
  accountExists,
  createAccount,
  createKadenaClient,
  createSignWithPactToolbox,
  details,
  getSignerAccount,
  getToolboxNetworkConfig,
  isToolboxInstalled,
} from '@kadena/client-utils/toolbox';
import type { WalletProvider } from '../../provider';

export class ToolboxWalletProvider implements WalletProvider {
  sign = createSignWithPactToolbox();
  quickSign = createSignWithPactToolbox();

  constructor(private kdaClient = createKadenaClient()) {
    if (!this.isInstalled()) {
      throw new Error('Pact Toolbox not installed');
    }
  }

  isInstalled() {
    return isToolboxInstalled();
  }

  async connect(networkId?: string) {
    if (!networkId) {
      const network = await this.getNetwork();
      networkId = network.networkId;
    }
    const signer = getSignerAccount();
    try {
      const account = await details(this.kdaClient, signer.account);
      return {
        address: account.account,
        publicKey: signer.publicKey,
      };
    } catch (e) {
      const account = await createAccount(this.kdaClient, this.sign, signer);
      return {
        address: account.account,
        publicKey: signer.publicKey,
      };
    }
  }

  async getSigner(networkId?: string) {
    if (!networkId) {
      const network = await this.getNetwork();
      networkId = network.networkId;
    }
    const signer = getSignerAccount();
    return {
      address: signer.account,
      publicKey: signer.publicKey,
    };
  }

  async getAccountDetails(networkId?: string) {
    if (!networkId) {
      const network = await this.getNetwork();
      networkId = network.networkId;
    }

    const signer = await this.getSigner(networkId);
    const d = await details(this.kdaClient, signer.address);
    return {
      address: d.account,
      publicKey: signer.publicKey,
      connectedSites: [],
      balance: parseFloat(d.balance),
    };
  }

  async getNetwork() {
    const networkConfig = getToolboxNetworkConfig();
    return {
      id: networkConfig.networkId,
      name: networkConfig.name,
      networkId: networkConfig.networkId,
      url: networkConfig.rpcUrl,
      isDefault: true,
    };
  }

  async isConnected(networkId?: string) {
    if (!networkId) {
      const network = await this.getNetwork();
      networkId = network.networkId;
    }
    const exist = await accountExists(
      this.kdaClient,
      getSignerAccount().account,
    );
    return !!exist;
  }

  async disconnect(_networkId?: string) {
    // no-op
  }
}
