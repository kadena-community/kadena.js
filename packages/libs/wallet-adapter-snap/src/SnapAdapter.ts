/**
 * SnapAdapter
 *
 * This module provides a comprehensive adapter implementation for the MetaMask Kadena Snap,
 * extending the BaseWalletAdapter from '@kadena/wallet-adapter-core'. It serves as a bridge
 * between your dApp and the MetaMask Snap, enabling you to:
 *
 * - Detect the MetaMask Snap provider and initialize connection parameters.
 * - Connect to the Snap and fetch account and network information.
 * - Handle account and network change events without forcing a page reload,
 *   keeping your application in sync with the Snap’s state.
 * - Sign transactions and commands via the Snap’s `kda_signTransaction` RPC.
 * - Gracefully handle errors (e.g., user rejection, missing Snap) and preserve
 *   connection state.
 * - Clean up event listeners and internal state via the `destroy()` method to
 *   prevent memory leaks.
 *
 * IMPORTANT:
 * - We do **not** reload the page (`window.location.reload()`), ensuring your dApp
 *   remains fully in control of its own state transitions.
 * - Network switching via the Snap API is **not** supported by this adapter; network
 *   changes must be managed externally if needed.
 */

import type {
  CommandSigDatas,
  IAccountInfo,
  IBaseWalletAdapterOptions,
  ICommand,
  INetworkInfo,
  ISigningRequestPartial,
} from '@kadena/wallet-adapter-core';
import { BaseWalletAdapter } from '@kadena/wallet-adapter-core';
import { ERRORS } from './constants';
import { defaultSnapOrigin } from './provider';
import type {
  ExtendedMethod,
  ExtendedMethodMap,
  IQuicksignResponse,
  ISnapAccount,
  ISnapNetwork,
} from './types';
import { safeJsonParse } from './utils/json';
/**
 * @public
 * SnapAdapter is a class that extends BaseWalletAdapter to provide
 * functionality for connecting to Kadena's Metamask snap.
 */
export class SnapAdapter extends BaseWalletAdapter {
  public name: string = 'Snap';

  /**
   * Constructor for the SnapAdapter.
   * @param options - Optional adapter options.
   */
  public constructor(options: IBaseWalletAdapterOptions) {
    super(options);
  }

  /**
   * Wraps wallet_invokeSnap calls
   */
  private async invokeSnap<T>(
    method: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    return this.provider.request({
      method: 'wallet_invokeSnap',
      params: { snapId: defaultSnapOrigin, request: { method, ...params } },
    }) as Promise<T>;
  }

  private async _checkStatus(): Promise<boolean> {
    return await this.invokeSnap<boolean>('kda_checkConnection');
  }
  /** Fetches and maps all networks from the Snap to INetworkInfo[] */
  private async _getNetworks(): Promise<INetworkInfo[]> {
    const networks = await this.invokeSnap<ISnapNetwork[]>('kda_getNetworks');
    console.log('NETWORKS ---------->', networks);
    return networks.map((net) => ({
      networkName: net.name,
      networkId: net.networkId,
      url: [net.nodeUrl],
    }));
  }

  private async _getActiveNetwork(): Promise<INetworkInfo> {
    const networks = await this.invokeSnap<ISnapNetwork[]>('kda_getNetworks');
    const currentNetworkId = await this.invokeSnap<string>(
      'kda_getActiveNetwork',
    );
    const currentNetwork = networks.find((e) => e.id == currentNetworkId);
    console.log('Hello!!---------------------->', currentNetwork);
    return {
      networkName: currentNetwork?.name ?? 'a',
      networkId: currentNetwork?.networkId ?? 'a',
      url: [currentNetwork?.nodeUrl ?? 'a'],
    };
  }
  /**
   * Fetches all accounts from the Snap to IAccountInfo[]
   */
  private async _getAccounts(): Promise<IAccountInfo[]> {
    const wallets = await this.invokeSnap<ISnapAccount[]>('kda_getAccounts');
    const network = await this._getActiveNetwork();
    if (!wallets?.length) {
      throw new Error(ERRORS.COULD_NOT_FETCH_ACCOUNT);
    }
    return wallets.map((wallet) => ({
      accountName: wallet.address,
      networkId: network.networkId,
      contract: 'coin',
      guard: { keys: [wallet.publicKey], pred: 'keys-all' },
      chainAccounts: [],
    }));
  }
  // --------------------------------------------------------------------------
  // CONNECTION LOGIC
  // --------------------------------------------------------------------------
  /**
   * Connect to the wallet by:
   * 1. Checking the current connection status.
   * 2. Requesting connection (if not already connected).
   * 3. Retrieving the account information.
   *
   * If an "invalid" error occurs, the active network is refreshed and the connection retried.
   *
   * @param finalParams - Parameters including networkId.
   * @param silent - If true, errors are swallowed and null is returned.
   * @returns Promise resolving to the AccountInfo or null if silent and an error occurs.
   */
  private async _connect(silent = false): Promise<IAccountInfo | null> {
    if (!this.provider) {
      throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    }

    try {
      // 1. Check if the Snap is connected
      const isConnected = await this._checkStatus();
      console.debug('Metamask Snap Connected?', isConnected);
      if (!isConnected) {
        // prompt the user to connect the Snap
        await this.provider.request({
          method: 'wallet_requestPermissions',
          params: [{ snapId: defaultSnapOrigin, permissions: {} }],
        });
        // re-check
        if (!(await this._checkStatus())) {
          throw new Error(ERRORS.FAILED_TO_CONNECT);
        }
      }

      // 2. Fetch all accounts and pick the first one
      const accounts = await this._getAccounts();
      return accounts[0];
    } catch (err: any) {
      // If the Snap complains about an invalid network, re-sync and retry once
      if (
        err instanceof Error &&
        err.message.toLowerCase().includes('invalid')
      ) {
        try {
          const activeNetwork = await this._getActiveNetwork();
          this.networkId = activeNetwork.networkId;
          return await this._connect(silent);
        } catch (fallbackErr) {
          if (silent) return null;
          throw fallbackErr;
        }
      }

      if (silent) {
        return null;
      }
      throw err;
    }
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

    const { id, method, params = {} } = args;

    switch (method) {
      case 'kadena_connect': {
        // In request mode, we do not use silent mode.
        const account = await this._connect(false);
        if (!account) {
          throw new Error(ERRORS.FAILED_TO_CONNECT);
        }
        return {
          id,
          jsonrpc: '2.0',
          result: account,
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getAccount_v1': {
        const result = (await this._getAccounts())[0];
        return {
          id,
          jsonrpc: '2.0',
          result: result,
        } as ExtendedMethodMap[M]['response'];
      }

      case 'kadena_getAccounts_v2': {
        // _getAccounts() returns ISnapAccount[]
        const result = await this._getAccounts();
        return {
          id,
          jsonrpc: '2.0',
          result, // IAccountInfo[]
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getNetwork_v1': {
        const resp = await this._getActiveNetwork();
        return {
          id,
          jsonrpc: '2.0',
          result: resp,
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getNetworks_v1': {
        const resp = await this._getNetworks();
        return {
          id,
          jsonrpc: '2.0',
          result: resp,
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_sign_v1': {
        console.log(params);
        const response = (await this.provider.request({
          method: 'kda_requestSign',
          data: {
            networkId: this.networkId,
            signingCmd: params as ISigningRequestPartial,
          },
        })) as {
          status: string;
          message: string;
          signedCmd: ICommand;
          error?: string;
        };

        if (response.status !== 'success') {
          const err =
            response.error ??
            response.message ??
            ERRORS.ERROR_SIGNING_TRANSACTION;
          throw new Error(err);
        }

        const result = {
          cmd: response.signedCmd.cmd,
          hash: response.signedCmd.hash,
          sigs: response.signedCmd.sigs,
        };

        return {
          id,
          jsonrpc: '2.0',
          result: {
            body: result,
            chainId: safeJsonParse(result.cmd)?.meta?.chainId,
          },
        } as ExtendedMethodMap[M]['response'];
      }
      //HACK: Doing a fallback to sign here is probably a good idea
      // case 'kadena_quicksign_v1': {
      //   const { commandSigDatas } = params as {
      //     commandSigDatas: CommandSigDatas;
      //   };
      //   const response = (await this.provider.request({
      //     method: 'kda_requestQuickSign',
      //     data: {
      //       networkId: this.networkId,
      //       commandSigDatas,
      //     },
      //   })) as IEckoQuicksignResponse;
      //
      //   if (response.status !== 'success') {
      //     const err =
      //       (response as IEckoQuicksignFailResponse).error ??
      //       (response as IEckoQuicksignFailResponse).message ??
      //       ERRORS.ERROR_SIGNING_TRANSACTION;
      //     throw new Error(err);
      //   }
      //
      //   const responses =
      //     'responses' in response ? response.responses : response.quickSignData;
      //
      //   if (!Array.isArray(responses)) {
      //     throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
      //   }
      //
      //   return {
      //     id,
      //     jsonrpc: '2.0',
      //     result: { responses } as IQuicksignResponse,
      //   } as ExtendedMethodMap[M]['response'];
      // }
      case 'kadena_checkStatus': {
        const status = await this._checkStatus();
        return {
          id,
          jsonrpc: '2.0',
          result: status,
        } as ExtendedMethodMap[M]['response'];
      }
      default:
        return (await this.provider.request(args)) as any;
    }
  }

  /**
   * “Disconnect” from the Snap by tearing down local state and listeners.
   * There’s no provider RPC for this in your list, so we just destroy.
   */
  public async disconnect(): Promise<void> {
    // Clear any adapter-side state
    //this.provider = undefined;
  }
}
