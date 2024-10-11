import { createClient, createTransaction } from '@kadena/client';
import {
  createCrossChainCommand,
  estimateGas,
  getAccountDetails,
  simpleTransferCreateCommand,
  transferCreateCommand,
} from '@kadena/client-utils';
import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';
import * as v from 'valibot';
import type { HostAddressGenerator } from './host.js';
import { defaultHostAddressGenerator } from './host.js';
import type {
  CreateCrossChainTransfer,
  CreateFinishCrossChainTransfer,
  CreateTransfer,
  IAccountDetails,
  IChain,
  ITransaction,
  ITransactionDescriptor,
  IWalletSDK,
  SimpleCreateTransfer,
  Transfer,
} from './interface.js';
import type { ResponseResult } from './schema.js';
import { responseSchema } from './schema.js';
import {
  kdnResolveAddressToName,
  kdnResolveNameToAddress,
} from './services/kdnChainResolver.js';

export class WalletSDK implements IWalletSDK {
  private _getHostUrl: HostAddressGenerator;

  public constructor(
    hostAddressGenerator: HostAddressGenerator = defaultHostAddressGenerator,
  ) {
    this._getHostUrl = hostAddressGenerator;
  }

  private async _getChains(
    networkId: string,
    chainIds?: ChainId[],
  ): Promise<ChainId[]> {
    return chainIds ?? (await this.getChains(networkId)).map((c) => c.id);
  }

  /** Create a transfer that only accepts `k:` accounts */
  public createSimpleTransfer(
    transfer: SimpleCreateTransfer & { networkId: string },
  ): IUnsignedCommand {
    const command = simpleTransferCreateCommand(transfer)();
    return createTransaction({
      ...command,
      networkId: transfer.networkId,
    });
  }

  /** create transfer that accepts any kind of account (requires keys/pred) */
  public createTransfer(transfer: CreateTransfer): IUnsignedCommand {
    return createTransaction(transferCreateCommand(transfer)());
  }

  /** create cross-chain transfer */
  public createCrossChainTransfer(
    transfer: CreateCrossChainTransfer,
  ): IUnsignedCommand {
    return createTransaction(createCrossChainCommand(transfer)());
  }

  /** create cross-chain transfer finish */
  public createFinishCrossChainTransfer(
    transfer: CreateFinishCrossChainTransfer,
  ): IUnsignedCommand {
    return null as any;
  }

  /** send signed transaction */
  public async sendTransaction(
    transaction: ICommand,
    networkId: string,
    chainId: ChainId,
  ): Promise<ITransactionDescriptor> {
    const host = this._getHostUrl({ networkId, chainId });
    console.log('host:', host);
    const result = await createClient(() => host).submitOne(transaction);
    return result;
  }

  public async getTransactions(
    accountName: string,
    fungible: string,
    networkId: string,
    chainsIds?: ChainId[],
  ): Promise<ITransaction[]> {
    return null as any;
  }

  public async getTransfers(
    accountName: string,
    fungible: string,
    networkId: string,
    chainsIds?: ChainId[],
  ): Promise<Transfer[]> {
    return null as any;
  }

  public subscribeOnCrossChainComplete(
    transfers: ITransactionDescriptor[],
    callback: (transfer: Transfer) => void,
  ): AbortController {
    return null as any;
  }

  public async waitForPendingTransaction(
    transaction: ITransactionDescriptor,
    options?: { signal?: AbortSignal },
  ): Promise<ResponseResult> {
    const host = this._getHostUrl({
      networkId: transaction.networkId,
      chainId: transaction.chainId,
    });
    const listenUrl = new URL(`${host}/api/v1/listen`);
    const data = await fetch(listenUrl.toString(), {
      signal: options?.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listen: transaction.requestKey }),
    })
      .then((res) => res.json())
      .catch(() => ({
        result: {
          status: 'failure',
          error: {
            message: 'Failed to get response from server',
            type: 'NetworkFailure',
          },
        } as ResponseResult,
      }));
    const parsed = v.safeParse(responseSchema, data);
    if (parsed.success === false) {
      console.log(`Parsing issues:\n${v.flatten(parsed.issues)}`);
      return {
        status: 'failure',
        error: {
          type: 'ParseFailure',
          message: 'Failed to parse response',
        },
      };
    }
    return parsed.output.result;
  }

  public subscribePendingTransactions(
    transactions: ITransactionDescriptor[],
    callback: (
      transaction: ITransactionDescriptor,
      result: ResponseResult,
    ) => void,
  ): AbortController {
    const controller = new AbortController();
    const promises = transactions.map(async (transaction) => {
      const result = await this.waitForPendingTransaction(transaction, {
        signal: controller.signal,
      });
      callback(transaction, result);
    });

    Promise.all(promises).catch((error) => {
      console.log(error);
    });

    return controller;
  }

  public async resolveAddressToName(
    address: string,
    networkId: string,
  ): Promise<string | undefined> {
    try {
      const host = this._getHostUrl({ networkId, chainId: '15' });
      const result = await kdnResolveAddressToName(address, networkId, host);

      if (result === undefined) {
        console.warn(`No address found for name: ${address}`);
      }
      return result;
    } catch (error) {
      console.error(`Error in name resolving action: ${error.message}`);
      // we could also return new Error(`Error in resolving address: ${error.message}`);
      // if we wish to always make the implementing applicatio naware of the error
      // that has occured instead of logging and still returning undefined
      return undefined;
    }
  }

  public async resolveNameToAddress(
    name: string,
    networkId: string,
  ): Promise<string | undefined> {
    try {
      const host = this._getHostUrl({ networkId, chainId: '15' });
      const result = await kdnResolveNameToAddress(name, networkId, host);

      if (result === undefined) {
        console.warn(`No address found for name: ${name}`);
      }
      return result;
    } catch (error) {
      console.error(`Error in name resolving action: ${error.message}`);
      // we could also return new Error(`Error in resolving address: ${error.message}`);
      // if we wish to always make the implementing applicatio naware of the error
      // that has occured instead of logging and still returning undefined
      return undefined;
    }
  }

  /*
  example
  public async resolveAddressToName(
    address: string,
    networkId: string,
  ): Promise<string | null > {
    try {
      const host = this._getHostUrl({ networkId, chainId: '15' });
      const result = await kdnResolveAddressToName(address, networkId, host);

      if (result === undefined) {
        console.warn(`No address found for name: ${address}`);
        return null;
      }
      return result;
    } catch (error) {
      console.error(`Error in name resolving action: ${error.message}`);
      throw new Error(`Error resolving address: ${error.message}`);
    }
  }
  */

  public async getAccountDetails(
    accountName: string,
    networkId: string,
    fungible: string,
    chainIds?: ChainId[],
  ): Promise<IAccountDetails[] | undefined> {
    const chains = await this._getChains(networkId, chainIds);
    const results = await Promise.all(
      chains.map(async (chainId) =>
        getAccountDetails({
          accountName,
          networkId,
          chainId,
          tokenId: fungible,
          host: this._getHostUrl({ networkId, chainId }),
        }),
      ),
    );
    return results;
  }

  public async getChains(networkHost: string): Promise<IChain[]> {
    // return Array.from(
    //   { length: 20 },
    //   (_, index) => ({ id: index.toString() }) as Chain,
    // );
    const res = await fetch(`${networkHost}/info`);
    const json: {
      nodeChains: string[];
      nodeVersion: string;
    } = await res.json();
    return json.nodeChains.map((c) => ({ id: c as ChainId }));
  }

  public async getGasEstimate(
    transaction: ICommand,
    networkId: string,
    chainId: ChainId,
  ): Promise<number> {
    const host = this._getHostUrl({ networkId, chainId });
    const result = await estimateGas(JSON.parse(transaction.cmd), host);
    return result.gasPrice;
  }

  public async getUSDPrice(currency: string): Promise<number> {
    if (currency !== 'USD') throw new Error('Unsupported currency');

    try {
      const response = await fetch(`https://api-v2.ethvm.dev/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationName: null,
          variables: {},
          query:
            '{getCoinGeckoTokenMarketDataByIds(coinGeckoTokenIds:["kadena"]){current_price}}',
        }),
      });
      const json = await response.json();
      const value =
        json?.data?.getCoinGeckoTokenMarketDataByIds?.[0]?.current_price;
      return value !== undefined ? parseFloat(String(value)) : 0;
    } catch (error) {
      return 0;
    }
  }
}

export const walletSdk = new WalletSDK();
