import type {
  ChainId,
  ICommand,
  IKeyPair,
  IQuicksignResponse,
  ISigningRequest,
  IUnsignedCommand,
} from '@kadena/client';

/**
 * @public
 * Represents a Kadena Network (e.g., mainnet01).
 * Conforms to KIP-0039 and KIP-0040.
 */
export interface NetworkInfo {
  networkName: string; // The display name of the network (e.g., "mainnet").
  networkId: string; // The unique identifier for the network (e.g., "mainnet01").
  url?: string[]; // Optional: The root endpoint URL(s) of the network.
}

/**
 * @public
 * An optional secretKey, ensuring that private keys can be omitted.
 */
export type OptionalKeyPair = Omit<IKeyPair, 'secretKey'> & {
  secretKey?: string;
};

/**
 * @public
 * Represents a Kadena account.
 * Conforms to KIP-0037 and KIP-0038.
 */
export interface AccountInfo {
  accountName: string; // The unique identifier for the account.
  networkId: string; // The unique identifier for the network for this account.
  contract: string; // Identifier for the fungible token contract.
  guard: {
    keys: string[]; // Array of public keys.
    pred: string; // Predicate defining key validation (e.g., "keys-all", "keys-any").
  };
  chainAccounts: string[]; // Array of chain IDs where this account exists.
}

/**
 * @public
 */
export interface Provider {
  request(args: { method: string; [key: string]: any }): Promise<unknown>;
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
}

/**
 * @public
 */
export type KdaConnectOptions = Record<string, any>;

/**
 * @public
 */
export type ISigningRequestPartial = {
  caps: ISigningRequest['caps'];
  code: string;
} & Omit<Partial<ISigningRequest>, 'caps' | 'pactCode'>;

/**
 * @public
 */
export type CommandSigDatas = {
  cmd: string;
  sigs: {
    pubKey: string;
    sig: string | null;
  }[];
}[];

/**
 * @public
 */
export interface BaseWalletAdapterOptions {
  provider: Provider;
  networkId?: string;
}

/**
 * @public
 */
export interface BaseWalletFactoryOptions {
  networkId?: string;
}

/**
 * @public
 */
export type AdapterFactoryCreator = <T extends BaseWalletFactoryOptions>(
  options: T,
) => {
  name: string;
  detect(): Promise<Provider | null>;
  adapter(provider: Provider): Promise<Adapter>;
};

/**
 * @public
 */
export type AdapterFactory = ReturnType<AdapterFactoryCreator>;

/**
 * @public
 */
export interface AdapterFactoryData {
  name: string;
  detected: boolean;
}

/**
 * @public
 * The standardized Adapter interface.
 * (Wallets/Adapters implement these methods).
 */
export interface Adapter {
  name: string;
  request(args: { method: string; [key: string]: any }): Promise<unknown>;

  on(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener: (...args: any[]) => void): this;

  connect(params?: unknown): Promise<AccountInfo | null>;
  disconnect(): Promise<void>;
  getActiveAccount(): Promise<AccountInfo>;
  getAccounts(): Promise<AccountInfo[]>;
  getActiveNetwork(): Promise<NetworkInfo>;
  getNetworks(): Promise<NetworkInfo[]>;
  signTransaction(
    transaction: IUnsignedCommand | IUnsignedCommand[],
  ): Promise<(IUnsignedCommand | ICommand) | (IUnsignedCommand | ICommand)[]>;
  signCommand(
    command: ISigningRequestPartial | IUnsignedCommand,
  ): Promise<ICommand | IUnsignedCommand>;

  onAccountChange(cb: (newAccount: AccountInfo) => void): void;
  onNetworkChange(cb: (newNetwork: NetworkInfo) => void): void;

  changeNetwork(
    network: NetworkInfo,
  ): Promise<{ success: boolean; reason?: string }>;
}

/**
 * @public
 */
export interface JsonRpcSuccess<T> {
  id: number;
  jsonrpc: '2.0';
  result: T;
}

/**
 * @public
 */
export interface JsonRpcError {
  id: number;
  jsonrpc: '2.0';
  error: {
    code: number;
    message: string;
    data?: object;
  };
}

/**
 * @public
 */
export type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcError;

/**
 * Core "kadena_*" method definitions (aligned with the spec).
 * Here we define the shape of each method's `params` and `response`.
 */

/**
 * @public
 */
export interface KdaMethodMap {
  kadena_connect: {
    params: KdaConnectOptions;
    response: JsonRpcResponse<any>;
  };
  kadena_disconnect: {
    params: { networkId?: string };
    response: JsonRpcResponse<void>;
  };
  kadena_getAccount_v1: {
    params: {};
    response: JsonRpcResponse<AccountInfo>;
  };
  kadena_getAccounts_v2: {
    params: {};
    response: JsonRpcResponse<AccountInfo[]>;
  };
  kadena_getNetwork_v1: {
    params: {};
    response: JsonRpcResponse<NetworkInfo>;
  };
  kadena_getNetworks_v1: {
    params: {};
    response: JsonRpcResponse<NetworkInfo[]>;
  };
  kadena_changeNetwork_v1: {
    params: { networkId: string };
    response: JsonRpcResponse<{ success: boolean; reason?: string }>;
  };
  kadena_sign_v1: {
    params: ISigningRequestPartial;
    response: JsonRpcResponse<{
      body: ICommand | IUnsignedCommand;
      chainId: ChainId;
    }>;
  };
  kadena_quicksign_v1: {
    params: { commandSigDatas: CommandSigDatas };
    response: JsonRpcResponse<IQuicksignResponse>;
  };
}

/**
 * @public
 */
export type KdaMethod = keyof KdaMethodMap;

/**
 * @public
 */
export type KdaRequestArgs<M extends KdaMethod> = {
  method: M;
} & { params?: KdaMethodMap[M]['params'] };

export { ChainId, ICommand, IKeyPair, IUnsignedCommand } from '@kadena/client';
