import { createClient } from '@kadena/client';
import {
  createCrossChainCommand,
  estimateGas,
  getAccountDetails,
  simpleTransferCreateCommand,
  transferCreateCommand,
} from '@kadena/client-utils';
import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';
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

export class WalletSDK implements IWalletSDK {
  private _getHostUrl: HostAddressGenerator;

  public constructor(
    hostAddressGenerator: HostAddressGenerator = defaultHostAddressGenerator,
  ) {
    this._getHostUrl = hostAddressGenerator;
  }

  /** Create a transfer that only accepts `k:` accounts */
  public createSimpleTransfer(
    transfer: SimpleCreateTransfer,
  ): IUnsignedCommand {
    return simpleTransferCreateCommand(transfer)();
  }

  /** create transfer that accepts any kind of account (requires keys/pred) */
  public createTransfer(transfer: CreateTransfer): IUnsignedCommand {
    return transferCreateCommand(transfer)();
  }

  /** create cross-chain transfer */
  public createCrossChainTransfer(
    transfer: CreateCrossChainTransfer,
  ): IUnsignedCommand {
    return createCrossChainCommand(transfer)();
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
    callback: (transfer: Transfer, transfers: Transfer[]) => void,
  ): () => void {
    return () => {};
  }

  public subscribePendingTransactions(
    transactions: ITransactionDescriptor[],
    callback: (transaction: ITransaction) => void,
  ): () => void {
    return () => {};
  }

  public async resolveAddressToName(
    address: string,
    networkId: string,
  ): Promise<string | undefined> {
    // const host = this._getHostUrl({ networkId, chainId: '15' });
    return null as any;
  }

  public async resolveNameToAddress(
    name: string,
    networkId: string,
  ): Promise<string | undefined> {
    // const host = this._getHostUrl({ networkId, chainId: '15' });
    return null as any;
  }

  public async getAccountDetails(
    accountName: string,
    networkId: string,
    fungible: string,
    chainIds?: ChainId[],
  ): Promise<IAccountDetails[] | undefined> {
    const host = this._getHostUrl({ networkId, chainId: '15' });
    const chains =
      chainIds ?? (await this.getChains(networkId)).map((c) => c.id);
    const results = await Promise.all(
      chains.map(async (chainId) =>
        getAccountDetails({
          accountName,
          networkId,
          chainId,
          tokenId: fungible,
          host,
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
