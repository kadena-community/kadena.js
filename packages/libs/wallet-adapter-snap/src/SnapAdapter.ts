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
  IEckoQuicksignFailResponse,
  IEckoQuicksignResponse,
  IKadenaCheckStatusRPC,
  IQuicksignResponse,
  IRawAccountResponse,
  IRawNetworkResponse,
  IRawRequestResponse,
  ISnapAccount,
} from './types';
import { safeJsonParse } from './utils/json';

/**
 * @public
 * EckoAdapter is a class that extends BaseWalletAdapter to provide
 * functionality for connecting to the Ecko Wallet.
 */
export class SnapAdapter extends BaseWalletAdapter {
  public name: string = 'Snap';

  // Listeners for 'kadena_networkChanged'.
  private _networkChangedListeners: Array<(network: INetworkInfo) => void> = [];
  // Stored account change listener references for later removal.
  private _accountChangeListeners: Array<(...args: any[]) => void> = [];

  /**
   * Constructor for the EckoAdapter.
   * @param options - Optional adapter options.
   */
  public constructor(options: IBaseWalletAdapterOptions) {
    super(options);
  }

  private async _connect(
    finalParams: { networkId: string },
    silent = false,
  ): Promise<IAccountInfo | null> {
    if (!this.provider) {
      throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    }

    // Helper to wrap all wallet_invokeSnap calls
    const invokeSnap = async <T>(
      method: string,
      params?: Record<string, unknown>,
    ): Promise<T> => {
      return this.provider!.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: { method, ...params },
        },
      }) as T;
    };

    try {
      // 1. Check if the Snap is connected
      const isConnected = await invokeSnap<boolean>('kda_checkConnection');
      if (!isConnected) {
        // prompt the user to connect the Snap
        await this.provider.request({
          method: 'wallet_requestPermissions',
          params: [{ snapId: defaultSnapOrigin, permissions: {} }],
        });
        // re-check
        if (!(await invokeSnap<boolean>('kda_checkConnection'))) {
          throw new Error(ERRORS.FAILED_TO_CONNECT);
        }
      }

      // 2. Fetch all accounts and pick the first one
      const accounts = await invokeSnap<ISnapAccount[]>('kda_getAccounts');
      if (!accounts?.length) {
        throw new Error(ERRORS.COULD_NOT_FETCH_ACCOUNT);
      }
      const wallet = accounts[0];

      // 3️⃣ Record the networkId and return normalized IAccountInfo
      this.networkId = finalParams.networkId;
      return {
        accountName: wallet.name,
        networkId: finalParams.networkId,
        contract: 'coin',
        guard: { keys: [wallet.publicKey], pred: 'keys-all' },
        chainAccounts: [],
      };
    } catch (err: any) {
      // If the Snap complains about an invalid network, re-sync and retry once
      if (
        err instanceof Error &&
        err.message.toLowerCase().includes('invalid')
      ) {
        try {
          const activeNetwork = await invokeSnap<string>(
            'kda_getActiveNetwork',
          );
          this.networkId = activeNetwork;
          return await this._connect({ networkId: activeNetwork }, silent);
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
  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  /**
   * === Handling Wallet Switching in Ecko Wallet ===
   *
   * When the 'selectedWallet' key in storage (within the chrome plugin) changes, it indicates that the user has
   * switched to a different account. This triggers the following behavior:
   *
   * 1. The 'activeDapps' array is reset to an empty state (`[]`).
   *    - This means all currently active dApps lose their active status.
   *    - This is due to Ecko’s connection logic, which requires a domain
   *      to be present in both `connectedSites` and `activeDapps` to maintain an active session.
   *
   * 2. Reconnection is required per account:
   *    - The `connectedSites` list is stored within the `selectedWallet` object.
   *    - Each account maintains its own list of connected domains.
   *    - Switching to a new wallet/account requires re-establishing dApp connections.
   *
   * In summary, every time a user switches accounts, previously connected dApps
   * need to be reconnected to regain an active status.
   *
   * Yet by design, this kinda sucks, because it will force the reconnect modal on the user
   * note: We wont do page-refreshes, as implemented by some to bypass this, by doing window.location.reload(),
   *
   * But we will need to reconnect to the wallet)
   * Source: [Ecko Wallet Background.js](https://github.com/eckoDAO-org/ecko-wallet/blob/main/public/app/background.js)
   */
  /**
   *
   *
  /**
   * Handle events emitted by the provider.
   * For "kadena_accountChanged", this method retrieves the new account info
   * (using the connection logic with silent mode) and also fires network change events if needed.
   *
   * @param event - The event name.
   * @param listener - The callback function.
   * @returns The instance of EckoAdapter.
   */
  public on(event: string, listener: (...args: any[]) => void): this {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    switch (event) {
      case 'kadena_accountChanged': {
        const mappedListener = async () => {
          try {
            const newNetwork = await this.getActiveNetwork();
            let newAccount: IAccountInfo | null = null;
            try {
              const resp = (await this.getActiveAccount()) as
                | IAccountInfo
                | IRawRequestResponse;
              if ('status' in resp && resp.status === 'fail') {
                throw new Error(resp.message || ERRORS.COULD_NOT_FETCH_ACCOUNT);
              }
              newAccount = resp as IAccountInfo;
            } catch (error) {
              // Use silent mode so that errors don't bubble up.
              newAccount = await this._connect(
                { networkId: newNetwork.networkId },
                true,
              );
              if (!newAccount) return;
            }

            this.networkId = newNetwork.networkId;
            for (const netListener of this._networkChangedListeners) {
              netListener(newNetwork);
            }
            if (newAccount) {
              listener(newAccount);
            }
          } catch (err) {
            console.error('Error handling account change event:', err);
          }
        };
        this._accountChangeListeners.push(mappedListener);
        this.provider.on('res_accountChange', mappedListener);
        break;
      }
      case 'kadena_networkChanged': {
        this._networkChangedListeners.push(
          listener as (network: INetworkInfo) => void,
        );
        break;
      }
      default:
        this.provider.on(event, listener);
    }
    return this;
  }

  /**
   * Remove a specific event listener.
   *
   * @param event - The event name.
   * @param listener - The callback function.
   * @returns The instance of EckoAdapter.
   */
  public off(event: string, listener: (...args: any[]) => void): this {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    switch (event) {
      case 'kadena_accountChanged':
        if (typeof this.provider.off === 'function') {
          this.provider.off('res_accountChange', listener);
        }
        this._accountChangeListeners = this._accountChangeListeners.filter(
          (l) => l !== listener,
        );
        break;
      case 'kadena_networkChanged':
        this._networkChangedListeners = this._networkChangedListeners.filter(
          (l) => l !== listener,
        );
        break;
      default:
        if (typeof this.provider.off === 'function') {
          this.provider.off(event, listener);
        }
    }
    return this;
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
    const finalParams = {
      networkId: this.networkId,
      // id, (id is not used, but included for completeness)
      // jsonrpc: "2.0", (jsonrpc is not used, but included for completeness)
      ...params,
    };

    switch (method) {
      case 'kadena_connect': {
        // In request mode, we do not use silent mode.
        const account = await this._connect(finalParams, false);
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
        if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
        await this.provider.request({
          method: 'kda_disconnect',
          ...finalParams,
        });
        this.destroy();
        return {
          id,
          jsonrpc: '2.0',
          result: undefined,
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getAccount_v1': {
        const resp = (await this.provider.request({
          method: 'kda_requestAccount',
          ...finalParams,
        })) as IRawAccountResponse;
        if (resp.status !== 'success' || !resp.wallet) {
          throw new Error(resp.message || ERRORS.COULD_NOT_FETCH_ACCOUNT);
        }
        return {
          id,
          jsonrpc: '2.0',
          result: {
            accountName: resp.wallet.account,
            networkId: this.networkId!,
            contract: 'coin',
            guard: { keys: [resp.wallet.publicKey], pred: 'keys-all' },
            chainAccounts: [],
          },
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getAccounts_v2': {
        const resp = (await this.provider.request({
          method: 'kda_requestAccount',
          ...finalParams,
        })) as IRawAccountResponse;
        if (resp.status !== 'success' || !resp.wallet) {
          throw new Error(resp.message || ERRORS.COULD_NOT_FETCH_ACCOUNT);
        }
        const account = {
          accountName: resp.wallet.account,
          networkId: this.networkId!,
          contract: 'coin',
          guard: { keys: [resp.wallet.publicKey], pred: 'keys-all' },
          chainAccounts: [],
        };
        return {
          id,
          jsonrpc: '2.0',
          result: [account],
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getNetwork_v1': {
        const resp = (await this.provider.request({
          method: 'kda_getNetwork',
        })) as IRawNetworkResponse;
        return {
          id,
          jsonrpc: '2.0',
          result: {
            networkName: resp.name,
            networkId: resp.networkId,
            url: [resp.url],
          },
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_getNetworks_v1': {
        const resp = (await this.provider.request({
          method: 'kda_getNetwork',
        })) as IRawNetworkResponse;
        const network = {
          networkName: resp.name,
          networkId: resp.networkId,
          url: [resp.url],
        };
        return {
          id,
          jsonrpc: '2.0',
          result: [network],
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_sign_v1': {
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
      case 'kadena_quicksign_v1': {
        const { commandSigDatas } = params as {
          commandSigDatas: CommandSigDatas;
        };
        const response = (await this.provider.request({
          method: 'kda_requestQuickSign',
          data: {
            networkId: this.networkId,
            commandSigDatas,
          },
        })) as IEckoQuicksignResponse;

        if (response.status !== 'success') {
          const err =
            (response as IEckoQuicksignFailResponse).error ??
            (response as IEckoQuicksignFailResponse).message ??
            ERRORS.ERROR_SIGNING_TRANSACTION;
          throw new Error(err);
        }

        const responses =
          'responses' in response ? response.responses : response.quickSignData;

        if (!Array.isArray(responses)) {
          throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
        }

        return {
          id,
          jsonrpc: '2.0',
          result: { responses } as IQuicksignResponse,
        } as ExtendedMethodMap[M]['response'];
      }
      case 'kadena_checkStatus': {
        return (await this.provider.request({
          method: 'kda_checkStatus',
          ...finalParams,
        })) as IKadenaCheckStatusRPC;
      }
      default:
        return (await this.provider.request(args)) as any;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    await this.provider.request({
      method: 'kda_disconnect',
      networkId: this.networkId,
    });
    this.destroy();
  }

  /**
   * Remove all event listeners attached by this adapter.
   * Use this when the adapter is no longer needed to prevent memory leaks.
   */
  public destroy(): void {
    if (this.provider && typeof this.provider.off === 'function') {
      this._accountChangeListeners.forEach((listener) => {
        this.provider!.off('res_accountChange', listener);
      });
    }
    this._accountChangeListeners = [];
  }
}
