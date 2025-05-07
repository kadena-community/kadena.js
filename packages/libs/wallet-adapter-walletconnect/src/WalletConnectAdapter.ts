import type {
  CommandSigDatas,
  IAccountInfo,
  IBaseWalletAdapterOptions,
  ISigningRequestPartial,
  JsonRpcResponse,
} from '@kadena/wallet-adapter-core';
import {
  BaseWalletAdapter,
  isJsonRpcSuccess,
} from '@kadena/wallet-adapter-core';
import { WalletConnectModal } from '@walletconnect/modal';
import Client from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { ERRORS } from './constants';
import type {
  WalletConnectAdapterOptions,
  WalletConnectProvider,
} from './provider';
import type {
  ExtendedMethod,
  ExtendedMethodMap,
  KadenaGetAccountsResponse,
} from './types';

// Fallback default values
const projectId = 'b56e18d47c72ab683b10814fe9495694'; // Public API key (localhost)
const relayUrl = 'wss://relay.walletconnect.com';
const defaultNetworkId = 'testnet04';

export class WalletConnectAdapter extends BaseWalletAdapter {
  public name: string = 'WalletConnect';
  protected declare provider: WalletConnectProvider;
  protected networkId: string;
  private client?: Client;
  private modal: WalletConnectModal;
  private options: WalletConnectAdapterOptions;

  public constructor(options: Partial<WalletConnectAdapterOptions>) {
    if (!options.provider) {
      throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    }
    const finalOptions: WalletConnectAdapterOptions = {
      ...options,
      provider: options.provider,
      projectId: options.projectId || projectId,
      relayUrl: options.relayUrl || relayUrl,
    };
    super(finalOptions as IBaseWalletAdapterOptions);
    this.options = finalOptions;
    this.networkId = (options.networkId as string) || defaultNetworkId;
    this.modal = new WalletConnectModal({
      themeMode: 'light',
      projectId: finalOptions.projectId,
      chains: ['kadena:mainnet01', 'kadena:testnet04', 'kadena:development'],
    });
  }

  public async request<M extends ExtendedMethod>(args: {
    id: number;
    method: M;
    params?: ExtendedMethodMap[M]['params'];
  }): Promise<ExtendedMethodMap[M]['response']> {
    if (!this.client) throw new Error(ERRORS.FAILED_TO_CONNECT);
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);

    const { id, method, params = {} } = args;

    switch (method) {
      case 'kadena_getAccount_v1':
        const accounts = await this.getAccounts([]);
        const [firstAccount] = accounts;

        return {
          id,
          jsonrpc: '2.0',
          result: {
            accountName: firstAccount.accountName,
            networkId: firstAccount.networkId,
            contract: firstAccount.contract,
            guard: {
              keys: firstAccount.guard.keys,
              pred: firstAccount.guard.pred,
            },
            chainAccounts: firstAccount.chainAccounts,
          },
        };
      case 'kadena_sign_v1': {
        if (!this.client || !this.provider?.session) {
          throw new Error(ERRORS.FAILED_TO_CONNECT);
        }

        // Send the constructed payload
        const response = (await this.provider.request({
          id,
          method: 'kadena_sign_v1',
          params: params as ISigningRequestPartial,
        })) as JsonRpcResponse<any>;

        console.log('/sign WalletConnect response:', response);
        if ('result' in response) {
          return {
            id,
            jsonrpc: '2.0',
            result: response.result.body,
          };
        }
        throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
      }
      case 'kadena_quicksign_v1': {
        if (!this.client || !this.provider?.session) {
          throw new Error(ERRORS.FAILED_TO_CONNECT);
        }

        const { commandSigDatas } = params as {
          commandSigDatas: CommandSigDatas;
        };

        const response = (await this.provider.request({
          id,
          method: 'kadena_quicksign_v1',
          params: { commandSigDatas },
        })) as JsonRpcResponse<any>;

        console.log('Quicksign response:', JSON.stringify(response));

        let responses: any[] = [];
        if ('results' in response) {
          responses = response.results as any[];
        } else if (isJsonRpcSuccess(response)) {
          responses = response.result.responses;
        }
        console.log('quicksign responses', responses);
        if (Array.isArray(responses) && responses.length > 0) {
          return {
            id,
            jsonrpc: '2.0',
            result: {
              responses: responses.map((response) => ({
                commandSigData: {
                  cmd: response.commandSigData.cmd,
                  sigs: response.commandSigData.sigs,
                },
                outcome: {
                  hash: response.outcome.hash,
                  result: response.outcome.result,
                },
              })),
            },
          };
        }
        throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
      }
      default: {
        if (!this.client || !this.provider?.session) {
          throw new Error(ERRORS.FAILED_TO_CONNECT);
        }
        const response = await this.client.request({
          topic: this.provider.session?.topic,
          chainId: `kadena:${this.networkId}`,
          request: {
            method: args.method,
            params: args.params ?? {},
          },
        });
        return {
          id,
          jsonrpc: '2.0',
          result: response,
        };
      }
    }
  }

  private async subscribeToEvents(): Promise<void> {
    if (!this.client) throw new Error(ERRORS.FAILED_TO_CONNECT);
    this.client.on('session_ping', (args) => {
      console.log('EVENT', 'session_ping', args);
    });

    this.client.on('session_event', (args) => {
      console.log('EVENT', 'session_event', args);
    });

    this.client.on('session_update', ({ topic, params }) => {
      console.log('EVENT', 'session_update', { topic, params });
      const { namespaces } = params;
      const _session = this.client!.session.get(topic);
      const updatedSession = { ..._session, namespaces };
      this.onSessionConnected(updatedSession).catch((error) => {
        console.error('Error updating session:', error);
      });
    });

    this.client.on('session_delete', () => {
      console.log('EVENT', 'session_delete');
    });
  }

  private async checkPersistedState(): Promise<void> {
    if (!this.client) throw new Error(ERRORS.FAILED_TO_CONNECT);

    const sessions = this.client.session.getAll();
    if (sessions.length) {
      await this.onSessionConnected(sessions[sessions.length - 1]);
    }
  }

  public async connect(): Promise<IAccountInfo> {
    try {
      if (!this.client) {
        this.client = await Client.init({
          relayUrl: this.options.relayUrl,
          projectId: this.options.projectId,
        });
        await this.subscribeToEvents();
        await this.checkPersistedState();
      }
      await this.connectWallet();
      return this.getActiveAccount();
    } catch (error) {
      console.error('Connection error:', error);
      throw new Error(ERRORS.FAILED_TO_CONNECT);
    }
  }

  private async connectWallet(pairing?: { topic: string }): Promise<void> {
    if (!this.client) throw new Error(ERRORS.FAILED_TO_CONNECT);

    const { uri, approval } = await this.client.connect({
      pairingTopic: pairing?.topic,
      requiredNamespaces: {
        kadena: {
          methods: [
            'kadena_getAccounts_v1',
            'kadena_sign_v1',
            'kadena_quicksign_v1',
          ],
          chains: [`kadena:${this.networkId}`],
          events: [],
        },
      },
    });

    if (uri) {
      this.modal.openModal({ uri }).catch((error) => {
        console.error('Error opening modal:', error);
      });
    }
    const session = await approval();
    await this.onSessionConnected(session);
    this.modal.closeModal();
  }

  private async onSessionConnected(
    session: SessionTypes.Struct,
  ): Promise<void> {
    this.provider = {
      connected: true,
      accounts: session.namespaces.kadena.accounts,
      session,
      request: async (args: { method: string; params?: any }) =>
        this.client!.request({
          topic: session.topic,
          chainId: `kadena:${this.networkId}`,
          request: {
            method: args.method,
            params: args.params ?? {},
          },
        }),
      on: (event, listener) => this.client!.on(event as any, listener),
      off: (event, listener) => this.client!.off(event as any, listener),
    };
  }

  public async disconnect(): Promise<void> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);

    if (!this.client || !this.provider || !this.provider.session) return;
    await this.client.disconnect({
      topic: this.provider.session.topic,
      reason: getSdkError('USER_DISCONNECTED'),
    });
  }
  // when the contracts[] param is omitted the wallet returns all known fungible accounts
  public async getAccounts(contracts?: string[]): Promise<IAccountInfo[]> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);

    console.log({
      method: 'kadena_getAccounts_v1',
      params: {
        accounts: this.provider.accounts.map((account) => ({ account })),
        contracts: contracts,
      },
    });

    const response = (await this.provider.request({
      method: 'kadena_getAccounts_v1',
      params: {
        accounts: this.provider.accounts.map((account) => ({ account })),
        contracts: contracts,
      },
    })) as KadenaGetAccountsResponse;

    console.log('getAccounts_v1 response:', response);
    if (!response?.accounts?.length) {
      throw new Error(ERRORS.COULD_NOT_FETCH_ACCOUNT);
    }

    const accountInfoList: IAccountInfo[] = response.accounts.flatMap(
      (accountData) =>
        (accountData.kadenaAccounts || []).map((kdaAccount) => ({
          accountName: kdaAccount.name,
          networkId: accountData.account.split(':')[1],
          contract: kdaAccount.contract,
          chainAccounts: kdaAccount.chains,
          guard: {
            keys: [accountData.publicKey],
            pred: 'keys-all',
          },
        })),
    );

    if (accountInfoList.length === 0) {
      console.log('Fallback for no accounts in wallet connect response');
      return response.accounts.map((accountData) => ({
        accountName: `k:${accountData.account.split(':')[2]}`,
        networkId: accountData.account.split(':')[1],
        contract: 'coin',
        chainAccounts: [],
        guard: {
          keys: [accountData.publicKey],
          pred: 'keys-all',
        },
      }));
    }

    const matchNetworkAccounts = accountInfoList.filter(
      (account) => account.networkId === this.networkId,
    );
    console.log({ accountInfoList, matchNetworkAccounts });

    if (!accountInfoList.length) {
      throw new Error(ERRORS.COULD_NOT_FETCH_ACCOUNT);
    }

    return accountInfoList;
  }

  public async getActiveAccount(contracts?: string[]): Promise<IAccountInfo> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);

    const allAccounts = await this.getAccounts(contracts);

    if (!allAccounts.length) {
      throw new Error(ERRORS.COULD_NOT_FETCH_ACCOUNT);
    }

    return allAccounts[0];
  }

  public async checkStatus(): Promise<{
    status: string;
    message?: string;
    account?: IAccountInfo;
  }> {
    return this.provider
      ? { status: 'connected', account: await this.getActiveAccount() }
      : { status: 'disconnected', message: 'Not connected' };
  }

  public async changeNetwork(): Promise<any> {
    throw new Error(ERRORS.KADENA_CHANGE_NETWORK_UNSUPPORTED);
  }
}
