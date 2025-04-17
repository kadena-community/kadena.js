/**
 * EckoWalletAdapter
 *
 * This module provides a comprehensive adapter implementation for Ecko Wallet,
 * extending the BaseWalletAdapter from '@kadena/wallet-adapter-core'. It serves as a bridge
 * between your dApp and the Ecko Wallet browser extension, enabling you to:
 *
 * - Detect the Ecko Wallet provider and initialize connection parameters.
 * - Connect to the wallet and fetch account and network information.
 * - Handle account and network change events, ensuring your application stays in sync
 *   with the wallet's current state.
 *
 *   IMPORTANT: We wont do page-refreshes, as implemented by some solutions to bypass this,
 *   by doing window.location.reload(),
 *   we cannot expect DAPPs to expect this, as they will not be aware of the change.
 *
 * - Sign transactions and commands using the Ecko Wallet's signing functionality.
 * - Manage connection state with robust error handling for scenarios such as failed connections
 *   or invalid network selections.
 * - Clean up event listeners via the destroy() method to prevent memory leaks.
 *
 * Note:
 * - The adapter does not support network switching via `kadena_changeNetwork_v1`.
 */

import type {
  AccountInfo,
  BaseWalletAdapterOptions,
  ICommand,
  NetworkInfo,
} from '@kadena/wallet-adapter-core';
import { BaseWalletAdapter } from '@kadena/wallet-adapter-core';
import { ERRORS } from './constants';
import type {
  ExtendedMethod,
  ExtendedMethodMap,
  IEckoQuicksignFailResponse,
  IEckoQuicksignResponse,
  IQuicksignResponse,
  kadenaCheckStatusRPC,
  RawAccountResponse,
  RawNetworkResponse,
  RawRequestResponse,
} from './types';
import { safeJsonParse } from './utils/json';

/**
 * @public
 * EckoWalletAdapter is a class that extends BaseWalletAdapter to provide
 * functionality for connecting to the Ecko Wallet.
 */
export class EckoWalletAdapter extends BaseWalletAdapter {
  public name: string = 'Ecko';

  // Listeners for 'kadena_networkChanged'.
  private _networkChangedListeners: Array<(network: NetworkInfo) => void> = [];
  // Stored account change listener references for later removal.
  private _accountChangeListeners: Array<(...args: any[]) => void> = [];

  /**
   * Constructor for the EckoWalletAdapter.
   * @param options - Optional adapter options.
   */
  public constructor(options: BaseWalletAdapterOptions) {
    super(options);
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
  private async _connect(
    finalParams: { networkId: string },
    silent = false,
  ): Promise<AccountInfo | null> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    try {
      // Check connection status.
      let statusResp = (await this.provider.request({
        method: 'kda_checkStatus',
        ...finalParams,
      })) as RawRequestResponse;

      if (statusResp.status !== 'success') {
        // Request a connection if not connected.
        await this.provider.request({
          method: 'kda_connect',
          ...finalParams,
        });
        statusResp = (await this.provider.request({
          method: 'kda_checkStatus',
          ...finalParams,
        })) as RawRequestResponse;
        if (statusResp.status !== 'success') {
          throw new Error(statusResp.message || ERRORS.FAILED_TO_CONNECT);
        }
      }

      // Retrieve account info.
      const accountResp = (await this.provider.request({
        method: 'kda_requestAccount',
        ...finalParams,
      })) as RawAccountResponse;
      if (accountResp.status !== 'success' || !accountResp.wallet) {
        throw new Error(accountResp.message || ERRORS.COULD_NOT_FETCH_ACCOUNT);
      }

      // Update adapter's networkId on a successful connection.
      this.networkId = finalParams.networkId;

      return {
        accountName: accountResp.wallet.account,
        networkId: finalParams.networkId,
        contract: 'coin',
        guard: { keys: [accountResp.wallet.publicKey], pred: 'keys-all' },
        chainAccounts: [],
      };
    } catch (err) {
      /*
       Fallback: if error message contains "invalid", refresh active network and retry.
       We do this to handle cases where the user has switched networks in the wallet but not in the dApp.
       or just to handle the case where the user has not selected a network yet.
       This is a workaround for the Ecko Wallet's behavior, which may not be ideal
       since it just won't show anything within the wallet.
      */
      if (
        err instanceof Error &&
        err.message.toLowerCase().includes('invalid')
      ) {
        const activeNetwork = await this.getActiveNetwork();
        this.networkId = activeNetwork.networkId;
        try {
          return await this._connect(
            {
              ...finalParams,
              networkId: activeNetwork.networkId,
            },
            silent,
          );
        } catch (fallbackErr) {
          if (silent) return null;
          throw fallbackErr;
        }
      }
      if (silent) return null;
      throw err;
    }
  }

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
   * @returns The instance of EckoWalletAdapter.
   */
  public on(event: string, listener: (...args: any[]) => void): this {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    switch (event) {
      case 'kadena_accountChanged': {
        const mappedListener = async () => {
          try {
            const newNetwork = await this.getActiveNetwork();
            let newAccount: AccountInfo | null = null;
            try {
              const resp = (await this.getActiveAccount()) as
                | AccountInfo
                | RawRequestResponse;
              if ('status' in resp && resp.status === 'fail') {
                throw new Error(resp.message || ERRORS.COULD_NOT_FETCH_ACCOUNT);
              }
              newAccount = resp as AccountInfo;
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
          listener as (network: NetworkInfo) => void,
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
   * @returns The instance of EckoWalletAdapter.
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
        })) as RawAccountResponse;
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
        })) as RawAccountResponse;
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
        })) as RawNetworkResponse;
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
        })) as RawNetworkResponse;
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
            signingCmd: params,
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
        const { commandSigDatas } = params as any;
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
        })) as kadenaCheckStatusRPC;
      }
      case 'kadena_changeNetwork_v1': {
        return {
          id,
          jsonrpc: '2.0',
          error: {
            code: -32004,
            message: ERRORS.KADENA_CHANGE_NETWORK_UNSUPPORTED,
          },
        };
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
