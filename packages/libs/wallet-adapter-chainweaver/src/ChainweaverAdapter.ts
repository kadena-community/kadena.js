import type { IQuicksignResponseOutcomes } from '@kadena/client';
import { createTransaction } from '@kadena/client';
import type {
  ChainId,
  CommandSigDatas,
  Guard,
  IAccountInfo,
  IBaseWalletAdapterOptions,
  IKdaMethodMap,
  INetworkInfo,
  IUnsignedCommand,
  JsonRpcResponse,
  KdaMethod,
  KdaRequestArgs,
  StandardSchemaV1,
} from '@kadena/wallet-adapter-core';
import { BaseWalletAdapter } from '@kadena/wallet-adapter-core';
import * as v from 'valibot';
import { CHAINWEAVER_ADAPTER, ERRORS } from './constants';
import type { IChainweaverProvider } from './provider';
import type { IResponseType } from './utils';
import { safeJsonParse } from './utils';

const connectSchema = v.object({
  appName: v.optional(v.string()),
});

interface IChainWeaverAccount {
  address: string;
  alias: string;
  chains: string[];
  guard: Guard;
  overallBalance: string;
}

interface IChainWeaverGetStatusResponse {
  payload: {
    accounts: IChainWeaverAccount[];
  };
}

interface IChainWeaverGetAccountsResponse {
  payload: IChainWeaverAccount[];
}

interface IChainWeaverGetNetworksResponse {
  payload: {
    uuid: string;
    networkId: string;
    name: string;
    default: boolean;
    creationTime: number;
    hosts: {
      url: string;
      submit: boolean;
      read: boolean;
      confirm: boolean;
    }[];
  }[];
}

interface IChainWeaverAdapterOptions extends IBaseWalletAdapterOptions {
  appName?: string;
  walletUrl?: string;
}

/**
 * @public
 * ChainweaverAdapter
 */
export class ChainweaverAdapter extends BaseWalletAdapter {
  public name: string = CHAINWEAVER_ADAPTER;
  public nonce: number = 0;
  public provider!: IChainweaverProvider;
  public connectSchema: StandardSchemaV1 = connectSchema;
  public appName: string = 'dApp';

  public constructor(options: IChainWeaverAdapterOptions) {
    if (options.provider === undefined) {
      throw new Error('Missing required option: provider');
    }

    super(options);

    if (options.appName !== undefined) {
      this.appName = options.appName;
    }
  }

  public async request<M extends KdaMethod>(
    args: KdaRequestArgs<M>,
  ): Promise<IKdaMethodMap[M]['response']> {
    // strict-boolean-expressions: compare explicitly rather than coerce to boolean
    if (this.provider === undefined) {
      throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    }

    this.nonce++;
    const method = args.method;
    const params = 'params' in args ? args.params : undefined;
    const parsedParams = (params ?? {}) as v.InferOutput<typeof connectSchema>;

    switch (method) {
      case 'kadena_connect': {
        this.provider.focus();

        const response = await this.provider.message('CONNECTION_REQUEST', {
          name: this.appName,
        });

        if ((response.payload as any).status !== 'accepted') {
          return {
            id: this.nonce,
            jsonrpc: '2.0',
            error: {
              code: 0,
              message: ERRORS.FAILED_TO_CONNECT,
            },
          } as JsonRpcResponse<IAccountInfo>;
        }

        const { payload } = (await this.provider.message('GET_STATUS', {
          name: this.appName,
        })) as IChainWeaverGetStatusResponse;

        this.provider.close();

        if (payload.accounts.length === 0) {
          throw new Error(ERRORS.NO_ACCOUNTS_FOUND);
        }

        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: {
            accountName: payload.accounts[0].address,
            label: payload.accounts[0].alias,
            networkId: this.networkId,
            contract: 'coin',
            guard: payload.accounts[0].guard,
            keyset: payload.accounts[0].guard,
            existsOnChains: payload.accounts[0].chains as ChainId[],
          } as IAccountInfo,
        };
      }

      case 'kadena_disconnect': {
        return Promise.resolve() as unknown as Promise<
          IKdaMethodMap['kadena_disconnect']['response']
        >;
      }

      case 'kadena_getAccount_v1': {
        const accounts = await this._getAccounts();
        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: accounts[0],
        };
      }

      case 'kadena_getAccounts_v2': {
        const accounts = await this._getAccounts();
        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: accounts,
        };
      }

      case 'kadena_getNetwork_v1': {
        const networks = await this._getNetworks();
        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: networks[0],
        } as JsonRpcResponse<any>;
      }

      case 'kadena_getNetworks_v1': {
        const networks = await this._getNetworks();
        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: networks,
        } as JsonRpcResponse<any>;
      }

      case 'kadena_quicksign_v1': {
        if (!('commandSigDatas' in parsedParams)) {
          throw new Error(
            'commandSigDatas param is required for kadena_quicksign_v1',
          );
        }

        const { commandSigDatas } = parsedParams as {
          commandSigDatas: CommandSigDatas;
        };

        const results: { tx: IUnsignedCommand; data: CommandSigDatas[0] }[] =
          [];
        for (const commandSigData of commandSigDatas) {
          const parsed = safeJsonParse(commandSigData.cmd);
          if (!parsed) {
            throw new Error(ERRORS.INVALID_PARAMS);
          }

          const tx = createTransaction(parsed);
          const response = (await this.provider.message(
            'SIGN_REQUEST',
            tx as any,
          )) as IResponseType<{
            transaction: IUnsignedCommand;
            status: 'signed' | 'rejected';
          }>;

          if (response.payload.status === 'signed') {
            results.push({
              tx: response.payload.transaction,
              data: commandSigData,
            });
          }
        }

        this.provider.close();

        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: {
            responses: results.map((result) => ({
              commandSigData: {
                cmd: result.data.cmd,
                sigs: result.tx.sigs,
              },
              outcome: {
                result: 'success',
                hash: result.tx.hash,
              },
            })),
          },
        } as JsonRpcResponse<IQuicksignResponseOutcomes>;
      }

      case 'kadena_sign_v1': {
        throw new Error(
          'kadena_sign_v1 is not supported in ChainweaverAdapter, use kadena_quicksign_v1 instead',
        );
      }

      default:
        throw new Error(ERRORS.METHOD_NOT_SUPPORTED(method));
    }
  }

  private async _getAccounts() {
    await this.provider.connect(true);
    const { payload } = (await this.provider.message('GET_ACCOUNTS', {
      name: this.appName,
    })) as IChainWeaverGetAccountsResponse;
    this.provider.close();

    console.log('Chainweaver accounts:', payload);
    if (payload.length === 0) {
      throw new Error(ERRORS.NO_ACCOUNTS_FOUND);
    }

    return payload.map(
      (account) =>
        ({
          accountName: account.address,
          label: account.alias,
          networkId: this.networkId,
          contract: 'coin',
          guard: account.guard,
          keyset: account.guard,
          existsOnChains: account.chains as ChainId[],
        }) as IAccountInfo,
    );
  }

  private async _getNetworks() {
    await this.provider.connect(true);
    const { payload } = (await this.provider.message('GET_NETWORK_LIST', {
      name: this.appName,
    })) as IChainWeaverGetNetworksResponse;
    this.provider.close();

    console.log('Chainweaver networks:', payload);
    if (payload.length === 0) {
      throw new Error(ERRORS.NO_ACCOUNTS_FOUND);
    }

    return payload.map(
      (network) =>
        ({
          networkId: network.networkId,
          networkName: network.name,
          urls: network.hosts.map((host) => host.url),
        }) as INetworkInfo,
    );
  }
}
