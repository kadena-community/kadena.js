// eslint-disable-next-line @rushstack/no-new-null
import { createClient, createTransaction } from '@kadena/client';
import {
  createCrossChainCommand,
  transferCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import { estimateGas } from '@kadena/client-utils/core';
import type {
  ChainId,
  ICommand,
  ISigner,
  IUnsignedCommand,
} from '@kadena/types';

import * as accountService from '../services/accountService.js';
import { pollRequestKeys } from '../services/chainweb/chainweb.js';
import { getChainTransfers } from '../services/graphql/getChainTransfers.js';
import { getTransfers } from '../services/graphql/getTransfers.js';
import { pollGraphqlTransfers } from '../services/graphql/pollTransfers.js';
import { isSameTransfer } from '../services/graphql/transfer.util.js';
import {
  createPrincipal,
  parseAccountNameAndKeys,
} from '../utils/accountName.js';
import { poll } from '../utils/retry.js';
import { arrayEquals, isEmpty, notEmpty } from '../utils/typeUtils.js';
import type { ICreateCrossChainFinishInput } from './crossChainFinishCreate.js';
import { crossChainFinishCreateCommand } from './crossChainFinishCreate.js';
import { exchange } from './exchange.js';
import type { ChainwebHostGenerator, GraphqlHostGenerator } from './host.js';
import {
  defaultChainwebHostGenerator,
  defaultGraphqlHostGenerator,
} from './host.js';
import type {
  IAccountDetails,
  IChain,
  ICreateCrossChainTransfer,
  ICreateTransfer,
  ICreateTransferCreate,
  ICreateTransferCreateOptional,
  ICrossChainTransfer,
  INodeChainInfo,
  INodeNetworkInfo,
  ITransactionDescriptor,
  ITransferOptions,
  ITransferResponse,
} from './interface.js';
import { KadenaNames } from './kadenaNames.js';
import type { ILogTransport, LogLevel } from './logger.js';
import { Logger } from './logger.js';
import type { ResponseResult } from './schema.js';

// createTransfer = regular transfer without guard
// createTransferCreate = transfer-create with guard
// createTransferCommand = underlying sync version
// createTransferCreateCommand = underlying sync version

/**
 * @public
 */
export class WalletSDK {
  private _chainwebHostGenerator: ChainwebHostGenerator;
  private _graphqlHostGenerator: GraphqlHostGenerator;
  public logger: Logger;

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
    this.logger = new Logger(
      options?.logLevel ?? 'WARN',
      options?.logTransport,
    );
    this.kadenaNames = new KadenaNames(this);

    this.getTransfers = this.getTransfers.bind(this);
    this.createTransfer = this.createTransfer.bind(this);
    this.createTransferCommand = this.createTransferCommand.bind(this);
    this.createTransferCreate = this.createTransferCreate.bind(this);
    this.createTransferCreateCommand =
      this.createTransferCreateCommand.bind(this);
    this.createCrossChainTransfer = this.createCrossChainTransfer.bind(this);
    this.createFinishCrossChainTransfer =
      this.createFinishCrossChainTransfer.bind(this);
    this.sendTransaction = this.sendTransaction.bind(this);
    this.getGasLimitEstimate = this.getGasLimitEstimate.bind(this);
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
      this.logger.error(
        'Failed to generate graphql url using graphqlHostGenerator method',
        { args },
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

  /** create transfer that accepts any kind of account (requires keys/pred) */
  public async createTransfer(
    transfer: ICreateTransfer,
  ): Promise<IUnsignedCommand> {
    const account = await this.getAccountDetails(
      transfer.receiver,
      transfer.networkId,
      'coin',
      [transfer.chainId],
    ).catch(() => []);

    if (account.length === 0) {
      if (transfer.receiver.startsWith('k:')) {
        this.logger.info(
          `Account ${transfer.receiver} does not exist on chain, returning transfer-create`,
          { transfer },
        );
        return this.createTransferCreateCommand({
          ...transfer,
          receiver: {
            account: transfer.receiver,
            keyset: {
              keys: [transfer.receiver.substring(2)],
              pred: 'keys-all',
            },
          },
        });
      }
      throw new Error(
        `Account ${transfer.receiver} not found on network ${transfer.networkId} chain ${transfer.chainId}`,
      );
    }

    return this.createTransferCommand(transfer);
  }

  /** create transfer that accepts any kind of account (requires keys/pred) */
  public createTransferCommand(transfer: ICreateTransfer): IUnsignedCommand {
    const command = transferCommand({
      ...transfer,
      sender: parseAccountNameAndKeys(transfer.sender),
    })();
    return createTransaction({
      ...command,
      networkId: transfer.networkId,
    });
  }

  /** create transfer that accepts any kind of account (requires keys/pred) */
  public async createTransferCreate(
    transfer: ICreateTransferCreateOptional,
  ): Promise<IUnsignedCommand> {
    const host = this.getChainwebUrl({
      networkId: transfer.networkId,
      chainId: transfer.chainId,
    });
    const resolvedAccountName = await createPrincipal({
      chainId: transfer.chainId,
      networkHost: new URL(host).origin,
      networkId: transfer.networkId,
      predicate: transfer.receiver.keyset.pred,
      publicKeys: transfer.receiver.keyset.keys.map((key) =>
        typeof key === 'string' ? key : key.pubKey,
      ),
    });

    if (
      transfer.receiver.account !== undefined &&
      transfer.receiver.account !== resolvedAccountName
    ) {
      throw new Error(
        `Invalid receiver account name: "${transfer.receiver.account}" expected it to be "${resolvedAccountName}"`,
      );
    }

    const accountName = transfer.receiver.account ?? resolvedAccountName;

    const [account] = await this.getAccountDetails(
      accountName,
      transfer.networkId,
      'coin',
      [transfer.chainId],
    ).catch(() => []);

    if (account !== undefined) {
      const chainPred = account.accountDetails?.guard.pred ?? 'keys-all';
      const chainKeys = account.accountDetails?.guard.keys ?? [];
      if (
        transfer.receiver.keyset.pred !== chainPred &&
        !arrayEquals(
          transfer.receiver.keyset.keys.map((key) =>
            typeof key === 'string' ? key : key.pubKey,
          ),
          chainKeys,
        )
      ) {
        throw new Error(
          `Account ${transfer.receiver} exists on chain with different keyset`,
        );
      }
      this.logger.info(`Account ${transfer.receiver} already exists on chain`);
    }
    return this.createTransferCreateCommand({
      ...transfer,
      receiver: {
        account: accountName,
        keyset: transfer.receiver.keyset,
      },
    });
  }

  /** create transfer that accepts any kind of account (requires keys/pred) */
  public createTransferCreateCommand(
    transfer: ICreateTransferCreate,
  ): IUnsignedCommand {
    const command = transferCreateCommand({
      ...transfer,
      // receiver:
      sender: parseAccountNameAndKeys(transfer.sender),
    })();
    return createTransaction({
      ...command,
      networkId: transfer.networkId,
    });
  }

  /** create cross-chain transfer */
  public createCrossChainTransfer(
    transfer: ICreateCrossChainTransfer & { networkId: string },
  ): IUnsignedCommand {
    const command = createCrossChainCommand(transfer)();
    return createTransaction({
      ...command,
      networkId: transfer.networkId,
    });
  }

  /** create cross-chain transfer finish */
  public async createFinishCrossChainTransfer(
    transfer: Omit<ICreateCrossChainFinishInput, 'host'>,
    gasPayer: { account: string; publicKeys: ISigner[] },
  ): Promise<IUnsignedCommand> {
    const host = this.getChainwebUrl({
      chainId: transfer.chainId,
      networkId: transfer.networkId,
    });
    const command = await crossChainFinishCreateCommand(
      {
        ...transfer,
        host,
      },
      gasPayer,
    );
    return command;
  }

  /** send signed transaction */
  public async sendTransaction(
    transaction: ICommand,
    networkId: string,
    chainId: ChainId,
  ): Promise<ITransactionDescriptor> {
    const host = this.getChainwebUrl({ networkId, chainId });
    const result = await createClient(() => host).submitOne(transaction);
    return result;
  }

  public async getTransfers(
    options: ITransferOptions,
  ): Promise<ITransferResponse> {
    const url = this.getGraphqlUrl({ networkId: options.networkId });
    if (options.chainId !== undefined) {
      return getChainTransfers(url, options);
    }
    return getTransfers(url, options);
  }

  public subscribeOnCrossChainComplete(
    accountName: string,
    transfers: ICrossChainTransfer[],
    callback: (transfer: ICrossChainTransfer) => void,
    options?: { signal?: AbortSignal },
  ): void {
    const promises = transfers.map(async (transfer) => {
      return poll(
        async (signal) => {
          const result = await pollGraphqlTransfers({
            accountName: accountName,
            graphqlUrl: this.getGraphqlUrl({
              networkId: transfer.networkId,
            }),
            logger: this.logger,
            requestKeys: [transfer.requestKey],
            signal,
          });
          const results = Object.values(result).flat();
          const match = results.find((resultTransfer) =>
            isSameTransfer(transfer, resultTransfer),
          );
          if (
            match &&
            match.isCrossChainTransfer &&
            match.continuation !== undefined
          ) {
            callback(match);
          } else {
            throw new Error('Cross-chain transfer not complete');
          }
        },
        {
          delayMs: 30000,
          timeoutSeconds: 3600,
          signal: options?.signal,
        },
      );
    });

    Promise.all(promises).catch((error) => {
      this.logger.error(
        `Error in subscribeOnCrossChainComplete: ${error.message}`,
        { error },
      );
    });
  }

  public async waitForPendingTransaction(
    transaction: ITransactionDescriptor,
    options?: { signal?: AbortSignal },
  ): Promise<ResponseResult> {
    const host = this.getChainwebUrl({
      networkId: transaction.networkId,
      chainId: transaction.chainId,
    });
    return poll(
      async (signal) => {
        const response = await pollRequestKeys({
          chainwebUrl: host,
          logger: this.logger,
          requestKeys: [transaction.requestKey],
          signal,
        });

        if (isEmpty(response[transaction.requestKey])) {
          throw new Error('Request key not found');
        }

        return response[transaction.requestKey].result;
      },
      {
        delayMs: 1000,
        timeoutSeconds: 120,
        signal: options?.signal,
      },
    );
  }

  public subscribePendingTransactions(
    transactions: ITransactionDescriptor[],
    callback: (
      transaction: ITransactionDescriptor,
      result: ResponseResult,
    ) => void,
    options?: {
      signal?: AbortSignal;
      confirmationDepth?: number;
      timeoutSeconds?: number;
      intervalMs?: number;
    },
  ): void {
    const groupByHost = transactions.reduce(
      (acc, tx) => {
        const host = this.getChainwebUrl({
          networkId: tx.networkId,
          chainId: tx.chainId,
        });
        acc[host] = acc[host] !== undefined ? acc[host] : [];
        acc[host].push(tx);
        return acc;
      },
      {} as Record<string, ITransactionDescriptor[]>,
    );

    const promises = Object.entries(groupByHost).map(async ([host, txs]) => {
      // List of request keys to poll
      let requestKeys = txs.map((tx) => tx.requestKey);

      return await poll(
        async (signal) => {
          const response = await pollRequestKeys({
            chainwebUrl: host,
            logger: this.logger,
            requestKeys: requestKeys,
            signal,
          });

          // Execute callback for finished request keys
          requestKeys.forEach((key) => {
            if (notEmpty(response[key])) {
              callback(
                txs.find((tx) => tx.requestKey === key)!,
                response[key].result,
              );
            }
          });

          // Remove finished request keys from list
          requestKeys = requestKeys.filter((key) => notEmpty(response[key]));

          // If there are still request keys to poll, throw an error so `poll` can retry
          if (requestKeys.length > 0) {
            throw new Error('Some Request Key(s) not found');
          }
        },
        {
          delayMs: options?.intervalMs ?? 1000,
          timeoutSeconds:
            options?.timeoutSeconds ??
            Math.max(60, (options?.confirmationDepth ?? 1) * 60),
          signal: options?.signal,
        },
      );
    });

    Promise.all(promises).catch((error) => {
      this.logger.error(
        `Error in subscribePendingTransactions: ${error.message}`,
        { error },
      );
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
      throw new Error(
        `Failed to get account details for "${accountName}": ${error.message}`,
      );
    }
  }

  public async getChains(networkHost: string): Promise<IChain[]> {
    const res = await fetch(`${networkHost}/info`);
    const json = (await res.json()) as INodeChainInfo;

    const chains = json.nodeChains ?? [];
    return chains.map((c) => ({ id: c as ChainId }));
  }

  public async getNetworkInfo(networkHost: string): Promise<INodeNetworkInfo> {
    const res = await fetch(`${networkHost}/info`);
    const json = (await res.json()) as INodeNetworkInfo & {
      nodeChains: string[];
    };

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      nodeChains = [],
      ...networkInfo
    } = json;

    return networkInfo;
  }

  public async getGasLimitEstimate(
    transaction: ICommand,
    networkId: string,
    chainId: ChainId,
  ): Promise<number> {
    const host = this.getChainwebUrl({ networkId, chainId });
    const result = await estimateGas(
      JSON.parse(transaction.cmd),
      new URL(host).origin,
    );
    return result.gasLimit;
  }
}

/**
 * @public
 */
export const walletSdk = new WalletSDK();
