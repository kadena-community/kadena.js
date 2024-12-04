import {
  addressToName,
  getChainIdByNetwork,
  nameToAddress,
} from '../services/kadenaNamesService.js';
import type { WalletSDK } from './walletSdk.js';

export class KadenaNames {
  private _sdk: WalletSDK;

  public constructor(walletSDK: WalletSDK) {
    this._sdk = walletSDK;
    this.nameToAddress = this.nameToAddress.bind(this);
    this.addressToName = this.addressToName.bind(this);
  }

  public async nameToAddress(
    name: string,
    networkId: string,
  ): Promise<string | null> {
    try {
      const host = this._sdk.getChainwebUrl({
        networkId,
        chainId: getChainIdByNetwork(networkId),
      });
      const result = await nameToAddress(name, networkId, host);

      if (result === undefined) {
        this._sdk.logger.warn(`No address found for name: ${name}`);
        return null;
      }
      return result;
    } catch (error) {
      this._sdk.logger.error(
        `Error in name resolving action: ${error.message}`,
      );
      throw new Error(`Error resolving address: ${error.message}`);
    }
  }

  public async addressToName(
    address: string,
    networkId: string,
  ): Promise<string | null> {
    try {
      const host = this._sdk.getChainwebUrl({
        networkId,
        chainId: getChainIdByNetwork(networkId),
      });
      const result = await addressToName(address, networkId, host);

      if (result === undefined) {
        this._sdk.logger.warn(`No address found for name: ${address}`);
        return null;
      }
      return result;
    } catch (error) {
      this._sdk.logger.error(
        `Error in name resolving action: ${error.message}`,
      );
      throw new Error(`Error resolving address: ${error.message}`);
    }
  }
}
