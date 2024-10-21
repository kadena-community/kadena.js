import {
  addressToName,
  nameToAddress,
} from '../services/kadenaNamesService.js';
import type { Logger } from './logger.js';
import type { WalletSDK } from './walletSdk.js';

export class KadenaNames {
  private _sdk: WalletSDK;
  private _logger: Logger;

  public constructor(walletSDK: WalletSDK) {
    this._sdk = walletSDK;
    this._logger = walletSDK['_logger'];
  }

  public async nameToAddress(
    name: string,
    networkId: string,
  ): Promise<string | null> {
    try {
      const host = this._sdk.hostUrlGenerator({
        networkId,
        chainId: '15',
      });
      const result = await nameToAddress(name, networkId, host);

      if (result === undefined) {
        this._logger.warn(`No address found for name: ${name}`);
        return null;
      }
      return result;
    } catch (error) {
      this._logger.error(`Error in name resolving action: ${error.message}`);
      throw new Error(`Error resolving address: ${error.message}`);
    }
  }

  public async addressToName(
    address: string,
    networkId: string,
  ): Promise<string | null> {
    try {
      const host = this._sdk.hostUrlGenerator({ networkId, chainId: '15' });
      const result = await addressToName(address, networkId, host);

      if (result === undefined) {
        this._logger.warn(`No address found for name: ${address}`);
        return null;
      }
      return result;
    } catch (error) {
      this._logger.error(`Error in name resolving action: ${error.message}`);
      throw new Error(`Error resolving address: ${error.message}`);
    }
  }
}
