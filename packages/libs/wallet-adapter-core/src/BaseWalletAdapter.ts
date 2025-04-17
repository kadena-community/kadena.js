import type { StandardSchemaV1 } from '@standard-schema/spec';
import { defaultConnectSchema, SchemaError } from './schema';
import type {
  AccountInfo,
  Adapter,
  BaseWalletAdapterOptions,
  ICommand,
  ISigningRequestPartial,
  IUnsignedCommand,
  KdaMethod,
  KdaMethodMap,
  KdaRequestArgs,
  NetworkInfo,
  Provider,
} from './types';
import {
  finalizeQuickSignTransaction,
  prepareQuickSignCmd,
  prepareSignCmd,
} from './utils/sign';
import { isJsonRpcResponse, isJsonRpcSuccess } from './utils/type-helpers';

// Default network id.
const DEFAULT_NETWORK_ID = 'mainnet01';

/**
 * @public
 * An abstract base adapter that implements common (and minimal) functionality.
 * Concrete adapters (e.g. Ecko, XWallet) can override or extend these behaviors.
 */
export abstract class BaseWalletAdapter implements Adapter {
  public abstract name: string;
  protected provider: Provider;
  protected networkId: string;
  public connectSchema: StandardSchemaV1 = defaultConnectSchema;

  public constructor(options: BaseWalletAdapterOptions) {
    this.provider = options.provider;
    this.networkId = options?.networkId || DEFAULT_NETWORK_ID;
  }

  /**
   * Forward a typed `request` to the underlying provider.
   * We cast the result to ensure it matches the method's return type.
   * Validates that the response is a JSON-RPC 2.0 compliant response.
   * Throws an error if the response does not conform to the standard.
   */
  public async request<M extends KdaMethod>(
    args: KdaRequestArgs<M>,
  ): Promise<KdaMethodMap[M]['response']> {
    const response = await this.provider.request(args);
    if (!isJsonRpcResponse(response)) {
      throw new Error('Provider response is not a valid JSON-RPC 2.0 response');
    }
    return response as KdaMethodMap[M]['response'];
  }

  public on(event: string, listener: (...args: any[]) => void): this {
    this.provider.on(event, listener);
    return this;
  }

  public off(event: string, listener: (...args: any[]) => void): this {
    this.provider.off(event, listener);
    return this;
  }

  /**
   * Connect: call `kadena_connect`. params are defined per specific adapter.
   */
  public async connect(
    params: StandardSchemaV1.InferInput<NonNullable<typeof this.connectSchema>>,
  ): Promise<AccountInfo | null> {
    let parsedParams = params as Record<string, any>;
    if (params !== undefined && this.connectSchema !== undefined) {
      const output = await this.connectSchema?.['~standard'].validate(params);
      if (output.issues) {
        throw new SchemaError(output.issues);
      }

      parsedParams = output.value as {};
    }
    const response = await this.request({
      method: 'kadena_connect',
      params: {
        networkId: this.networkId,
        ...parsedParams,
      },
    });

    return isJsonRpcSuccess(response) ? response.result : null;
  }

  /**
   * Disconnect: call `kadena_disconnect` with optional networkId.
   */
  public async disconnect(): Promise<void> {
    await this.request({
      method: 'kadena_disconnect',
      params: {
        networkId: this.networkId,
      },
    });
  }

  /**
   * Returns the currently active account by calling `kadena_getAccount_v1`.
   */
  public async getActiveAccount(): Promise<AccountInfo> {
    const response = await this.request({
      method: 'kadena_getAccount_v1',
    });
    if (isJsonRpcSuccess(response)) {
      return response.result;
    }
    throw new Error('Failed to fetch account');
  }

  /**
   * Retrieve all accounts via `kadena_getAccounts_v2`.
   */
  public async getAccounts(): Promise<AccountInfo[]> {
    const response = await this.request({
      method: 'kadena_getAccounts_v2',
    });
    return isJsonRpcSuccess(response) ? response.result : [];
  }

  /**
   * Get the currently active network by calling `kadena_getNetwork_v1`.
   */
  public async getActiveNetwork(): Promise<NetworkInfo> {
    const response = await this.request({
      method: 'kadena_getNetwork_v1',
    });
    if (isJsonRpcSuccess(response)) {
      return response.result;
    }
    throw new Error('Failed to fetch network');
  }

  /**
   * Retrieve all networks via `kadena_getNetworks_v1`.
   */
  public async getNetworks(): Promise<NetworkInfo[]> {
    const response = await this.request({
      method: 'kadena_getNetworks_v1',
    });
    return isJsonRpcSuccess(response) ? response.result : [];
  }

  /**
   * Sign a transaction: call `kadena_signTransaction`.
   * Uses kadena_quicksign_v1
   */
  public async signTransaction(
    command: IUnsignedCommand | IUnsignedCommand[],
  ): Promise<(IUnsignedCommand | ICommand) | (IUnsignedCommand | ICommand)[]> {
    const { commandSigDatas, transactionHashes, transactions, isList } =
      await prepareQuickSignCmd(command);

    const response = await this.request({
      method: 'kadena_quicksign_v1',
      params: {
        commandSigDatas,
      },
    });

    if (isJsonRpcSuccess(response)) {
      return finalizeQuickSignTransaction(
        response.result,
        transactionHashes,
        transactions,
        isList,
      );
    }

    throw new Error('Error signing transaction');
  }

  /**
   * Sign a command: call `kadena_signCommand`.
   * Uses kadena_sign_v1
   */
  public async signCommand(
    command: IUnsignedCommand | ISigningRequestPartial,
  ): Promise<ICommand | IUnsignedCommand> {
    const signingCmd = prepareSignCmd(command);

    const response = await this.request({
      method: 'kadena_sign_v1',
      params: signingCmd,
    });

    if (isJsonRpcSuccess(response)) {
      return response.result.body;
    }
    throw new Error('Error signing command');
  }

  /**
   * Subscribe to account-change events.
   */
  public onAccountChange(cb: (newAccount: AccountInfo) => void): void {
    this.on('kadena_accountChanged', cb);
  }

  /**
   * Subscribe to network-change events.
   */
  public onNetworkChange(cb: (newNetwork: NetworkInfo) => void): void {
    this.on('kadena_networkChanged', cb);
  }

  /**
   * Change the wallet's network by calling `kadena_changeNetwork_v1`.
   */
  public async changeNetwork(
    network: NetworkInfo,
  ): Promise<{ success: boolean; reason?: string }> {
    try {
      const response = await this.request({
        method: 'kadena_changeNetwork_v1',
        params: {
          networkId: network.networkId,
        },
      });

      if (isJsonRpcSuccess(response)) {
        this.networkId = network.networkId;
        return response.result;
      }
      return { success: false, reason: response.error.message };
    } catch (error) {
      return { success: false, reason: (error as Error).message };
    }
  }
}
