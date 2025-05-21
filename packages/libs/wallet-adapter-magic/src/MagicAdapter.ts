/**
 * MagicAdapter
 *
 * This module provides a comprehensive adapter implementation for Magic Wallet,
 * extending the BaseWalletAdapter from '@kadena/wallet-adapter-core'. It serves as a bridge
 * between your dApp and the Magic Wallet browser extension, enabling you to:
 *
 * - Detect the Magic Wallet provider and initialize connection parameters.
 * - Connect to the wallet and fetch account and network information.
 * - Handle account and network change events, ensuring your application stays in sync
 *   with the wallet's current state.
 *
 *   IMPORTANT: We wont do page-refreshes, as implemented by some solutions to bypass this,
 *   by doing window.location.reload(),
 *   we cannot expect DAPPs to expect this, as they will not be aware of the change.
 *
 * - Sign transactions and commands using the Magic Wallet's signing functionality.
 * - Manage connection state with robust error handling for scenarios such as failed connections
 *   or invalid network selections.
 * - Clean up event listeners via the destroy() method to prevent memory leaks.
 *
 * Note:
 * - The adapter does not support network switching via `kadena_changeNetwork_v1`.
 */

import { createTransaction } from '@kadena/client';
import type {
  ChainId,
  CommandSigDatas,
  IAccountInfo,
  IBaseWalletAdapterOptions,
  ICommand,
  ISigningRequestPartial,
} from '@kadena/wallet-adapter-core';
import { BaseWalletAdapter } from '@kadena/wallet-adapter-core';
import { KadenaExtension } from '@magic-ext/kadena';
import type { Extension } from 'magic-sdk';
import { Magic } from 'magic-sdk';
import { ERRORS } from './constants';
import type {
  ExtendedMethod,
  ExtendedMethodMap,
  IQuicksignResponse,
} from './types';
import { safeJsonParse } from './utils/json';

export interface IMagicAdapterOptions extends IBaseWalletAdapterOptions {
  CHAINWEBAPIURL: string;
  CHAINID: string;
  NETWORKID: string;
  MAGIC_APIKEY: string;
}

const deriveGuardFromAccount = (
  account: Awaited<ReturnType<KadenaExtension['loginWithSpireKey']>>,
) => {
  if (account.guard && 'keys' in account.guard && 'pred' in account.guard) {
    return {
      keys: account.guard.keys,
      pred: account.guard.pred,
    };
  }
  if (account.accountName.startsWith('k:')) {
    return {
      keys: [account.accountName],
      pred: 'keys-all',
    };
  }
  return null;
};

/**
 * @public
 * MagicAdapter is a class that extends BaseWalletAdapter to provide
 * functionality for connecting to the Magic Wallet.
 */
export class MagicAdapter extends BaseWalletAdapter {
  public name: string = 'Magic';

  private _magic: Magic | null = null;
  private _account: IAccountInfo | null = null;

  /**
   * Constructor for the MagicAdapter.
   * @param options - Optional adapter options.
   */
  public constructor(options: IMagicAdapterOptions) {
    super(options);

    if (
      !options.MAGIC_APIKEY ||
      !options.CHAINWEBAPIURL ||
      !options.CHAINID ||
      !options.NETWORKID
    ) {
      throw new Error(
        'Missing required options: MAGIC_APIKEY, CHAINWEBAPIURL, CHAINID, NETWORKID',
      );
    }

    const kdaExtension = new KadenaExtension({
      rpcUrl: options.CHAINWEBAPIURL,
      chainId: options.CHAINID as ChainId,
      networkId: options.NETWORKID,
      createAccountsOnChain: true,
    }) as unknown as Extension<string>;

    this._magic = new Magic(options.MAGIC_APIKEY, {
      extensions: [kdaExtension],
    });
  }

  private async _connect(): Promise<IAccountInfo | null> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    if (!this._magic) throw new Error(ERRORS.MAGIC_NOT_INITIALIZED);

    const account = await (
      this._magic.kadena as KadenaExtension
    ).loginWithSpireKey();

    const guard = deriveGuardFromAccount(account);
    if (!guard) {
      throw new Error(ERRORS.INVALID_GUARD);
    }

    this._account = {
      accountName: account.accountName,
      contract: account.requestedFungibles?.[0].fungible ?? 'coin',
      chainAccounts: account.chainIds,
      networkId: account.networkId,
      guard,
    };

    return this._account;
  }

  // --------------------------------------------------------------------------
  // REQUEST HANDLING
  // --------------------------------------------------------------------------
  /**
   * Handles requests to the provider by mapping method names to provider calls.
   *
   * @param args - The method and parameters for the request.
   * @returns A promise resolving to the response, cast to the appropriate type.
   * @throws Error if the provider is not detected or the method is unsupported.
   *
   * This implementation supports extended methods from ExtendedMethodMap, including special handling
   * for 'kadena_checkStatus'.
   */
  public async request<M extends ExtendedMethod>(args: {
    id: number;
    method: M;
    params?: ExtendedMethodMap[M]['params'];
  }): Promise<ExtendedMethodMap[M]['response']> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    if (!this._magic) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);

    const { id, method, params = {} } = args;

    switch (method) {
      case 'kadena_connect': {
        // In request mode, we do not use silent mode.
        const account = await this._connect();
        if (!account) {
          throw new Error(ERRORS.FAILED_TO_CONNECT);
        }
        return {
          id,
          jsonrpc: '2.0',
          result: account,
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_disconnect': {
        return {
          id,
          jsonrpc: '2.0',
          result: undefined,
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getAccount_v1': {
        if (!this._account) {
          await this._connect();
        }
        return {
          id,
          jsonrpc: '2.0',
          result: this._account,
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getAccounts_v2': {
        if (!this._account) {
          await this._connect();
        }
        return {
          id,
          jsonrpc: '2.0',
          result: [this._account],
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getNetwork_v1': {
        return {
          id,
          jsonrpc: '2.0',
          error: { code: -32601, message: 'Not implemented', data: {} },
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getNetworks_v1': {
        return {
          id,
          jsonrpc: '2.0',
          error: { code: -32601, message: 'Not implemented', data: {} },
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_sign_v1': {
        if (!this._account) {
          await this._connect();
        }

        const request = params as ISigningRequestPartial;

        const tx = createTransaction({
          payload: {
            exec: {
              code: request.code,
              data: request.data,
            },
          },
          meta: {
            chainId: request.chainId,
            gasLimit: request.gasLimit,
            gasPrice: request.gasPrice,
            sender: request.sender,
            ttl: request.ttl,
          },
          nonce: request.nonce,
        });

        const { transactions } = await (
          this._magic.kadena as KadenaExtension
        ).signTransactionWithSpireKey(tx);

        const transaction = transactions[0];

        return {
          id,
          jsonrpc: '2.0',
          result: {
            body: transaction,
            chainId: safeJsonParse(transaction.cmd)?.meta?.chainId,
          },
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_quicksign_v1': {
        const { commandSigDatas } = params as {
          commandSigDatas: CommandSigDatas;
        };

        const results = await Promise.all(
          commandSigDatas.map(async (commandSigData) => {
            if (!this._magic) throw new Error(ERRORS.MAGIC_NOT_INITIALIZED);

            const tx = createTransaction(safeJsonParse(commandSigData.cmd));
            tx.sigs = commandSigData.sigs.map((sig) => ({
              sig: sig.sig ?? undefined,
              pubKey: sig.pubKey,
            }));

            const { transactions } = await (
              this._magic.kadena as KadenaExtension
            ).signTransactionWithSpireKey(tx);

            return transactions[0] as ICommand;
          }),
        );

        if (!Array.isArray(results)) {
          throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
        }

        const responses = results.map((result) => {
          return {
            commandSigData: { cmd: result.cmd, sigs: result.sigs },
            outcome: { result: 'success', hash: result.hash },
          };
        });

        return {
          id,
          jsonrpc: '2.0',
          result: { responses } as IQuicksignResponse,
        } as ExtendedMethodMap[M]['response'];
      }
      default:
        return (await this.provider.request(args)) as any;
    }
  }
}
