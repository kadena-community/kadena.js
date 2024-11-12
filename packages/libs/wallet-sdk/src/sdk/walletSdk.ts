// eslint-disable-next-line @rushstack/no-new-null
import { createClient, createTransaction } from '@kadena/client';
import {
  createCrossChainCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import { estimateGas } from '@kadena/client-utils/core';
import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/types';
import * as v from 'valibot';

import * as accountService from '../services/accountService.js';
import { getTransfers } from '../services/graphql/getTransfers.js';
import { exchange } from './exchange.js';
import type { ChainwebHostGenerator, GraphqlHostGenerator } from './host.js';
import {
  defaultChainwebHostGenerator,
  defaultGraphqlHostGenerator,
} from './host.js';
import type {
  CreateCrossChainTransfer,
  CreateFinishCrossChainTransfer,
  CreateTransfer,
  IAccountDetails,
  IChain,
  ITransactionDescriptor,
  SimpleCreateTransfer,
  Transfer,
} from './interface.js';
import { KadenaNames } from './kadenaNames.js';
import type { ILogTransport, LogLevel } from './logger.js';
import { Logger } from './logger.js';
import type { ResponseResult } from './schema.js';
import { responseSchema } from './schema.js';
import { simpleTransferCreateCommand } from './utils-tmp.js';

export class WalletSDK {
  private _chainwebHostGenerator: ChainwebHostGenerator;
  private _graphqlHostGenerator: GraphqlHostGenerator;
  public _logger: Logger;

  public kadenaNames: KadenaNames;
  public exchange: typeof exchange = exchange;

  public constructor(options?: {
    chainwebHostGenerator?: ChainwebHostGenerator;
    graphqlHostGenerator?: GraphqlHostGenerator;
    logTransport?: ILogTransport;
    logLevel?: LogLevel;
  }) {
    this._chainwebHostGenerator =
      options?.chainwebHostGenerator ?? defaultChainwebHostGenerator;
    this._graphqlHostGenerator =
      options?.graphqlHostGenerator ?? defaultGraphqlHostGenerator;
    this._logger = new Logger(
      options?.logLevel ?? 'WARN',
      options?.logTransport,
    );
    this.kadenaNames = new KadenaNames(this);
  }

  public getChainwebUrl(
    ...args: Parameters<ChainwebHostGenerator>
  ): ReturnType<ChainwebHostGenerator> {
    const result = this._chainwebHostGenerator(...args);
    if (!result) {
      throw new Error(
        'Failed to generate chainweb url using chainwebHostGenerator method',
      );
    }
    return result;
  }

  public getGraphqlUrl(
    ...args: Parameters<GraphqlHostGenerator>
  ): ReturnType<GraphqlHostGenerator> {
    const result = this._graphqlHostGenerator(...args);
    if (!result) {
      this._logger.error(
        'Failed to generate graphql url using graphqlHostGenerator method',
      );
      throw new Error(
        'Failed to generate chainweb url using graphqlHostGenerator method',
      );
    }
    return result;
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
  public createTransfer(
    transfer: CreateTransfer & { networkId: string },
  ): IUnsignedCommand {
    const command = transferCreateCommand(transfer)();
    return createTransaction({
      ...command,
      networkId: transfer.networkId,
    });
  }

  /** create cross-chain transfer */
  public createCrossChainTransfer(
    transfer: CreateCrossChainTransfer & { networkId: string },
  ): IUnsignedCommand {
    const command = createCrossChainCommand(transfer)();
    return createTransaction({
      ...command,
      networkId: transfer.networkId,
    });
  }

  /** create cross-chain transfer finish */
  public createFinishCrossChainTransfer(
    transfer: CreateFinishCrossChainTransfer,
  ): IUnsignedCommand {
    return {} as IUnsignedCommand;
  }

  /** send signed transaction */
  public async sendTransaction(
    transaction: ICommand,
    networkId: string,
    chainId: ChainId,
  ): Promise<ITransactionDescriptor> {
    // const parsed = JSON.parse(transaction.cmd); // unused
    const host = this.getChainwebUrl({ networkId, chainId });
    const result = await createClient(() => host).submitOne(transaction);
    return result;
  }

  public async getTransfers(
    accountName: string,
    networkId: string,
    fungible?: string,
    chainsIds?: ChainId[],
  ): Promise<Transfer[]> {
    const url = this.getGraphqlUrl({ networkId });
    const transfers = await getTransfers(url, accountName, fungible);
    return transfers;
  }

  public subscribeOnCrossChainComplete(
    transfers: ITransactionDescriptor[],
    callback: (transfer: Transfer) => void,
    options?: { signal?: AbortSignal },
  ): void {
    return undefined;
  }

  public async waitForPendingTransaction(
    transaction: ITransactionDescriptor,
    options?: { signal?: AbortSignal },
  ): Promise<ResponseResult> {
    const host = this.getChainwebUrl({
      networkId: transaction.networkId,
      chainId: transaction.chainId,
    });
    // TODO: refactor to poll
    // if options is in kadena client now, use that
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
      this._logger.warn(
        `[WalletSDk] waitForPendingTransaction Parsing issues:\n${v.flatten(parsed.issues)}`,
        { transaction, issues: parsed.issues },
      );
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
    options?: { signal?: AbortSignal },
  ): void {
    const promises = transactions.map(async (transaction) => {
      const result = await this.waitForPendingTransaction(transaction, {
        signal: options?.signal,
      });
      callback(transaction, result);
    });

    Promise.all(promises).catch((error) => {
      // console.log(error);
    });
  }

  public async getAccountDetails(
    accountName: string,
    networkId: string,
    fungible: string,
    chainIds?: ChainId[],
  ): Promise<IAccountDetails[]> {
    try {
      const chains = await this._getChains(networkId, chainIds);

      const accountDetailsList = await accountService.getAccountDetails(
        accountName,
        networkId,
        fungible,
        chains,
        this.getChainwebUrl.bind(this),
      );

      return accountDetailsList;
    } catch (error) {
      this._logger.error(`Error in fetching account details: ${error.message}`);
      throw new Error(`Failed to get account details for ${accountName}`);
    }
  }

  public async getChains(networkHost: string): Promise<IChain[]> {
    const res = await fetch(`${networkHost}/info`);
    const json: {
      nodeChains: string[];
      nodeVersion: string;
    } = await res.json();
    return json.nodeChains.map((c) => ({ id: c as ChainId }));
  }

  public async getNetworkInfo(networkHost: string): Promise<unknown> {
    return null;
  }

  public async getGasLimitEstimate(
    transaction: ICommand,
    networkId: string,
    chainId: ChainId,
  ): Promise<number> {
    const host = this.getChainwebUrl({ networkId, chainId });
    const result = await estimateGas(JSON.parse(transaction.cmd), host);
    return result.gasLimit;
  }
}

export const walletSdk = new WalletSDK();
