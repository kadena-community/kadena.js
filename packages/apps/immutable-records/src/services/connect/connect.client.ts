import { Evt, to } from 'evt';
import type { WalletConnectModal } from './connect.modal';
import { createModalInstance } from './connect.modal';
import type { ClientEvents } from './connect.utils';
import {
  CLIENT_ERRORS,
  CLIENT_EVENTS,
  getAccountsRequest,
  timeout,
} from './connect.utils';

export type SignClient = Awaited<
  ReturnType<
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    Awaited<typeof import('@walletconnect/sign-client')>['SignClient']['init']
  >
>;

export interface KadenaAccount {
  name: string;
  contract: string;
  chains: string[];
}

/**
 * Wallet connect client
 *
 * Wrapper around the Wallet connect SDK to make it easy to use with Kadena
 *
 * This class should be treated as a singleton, and never instantiated multiple times.
 */
export class WalletConnectClient {
  private _state: 'unloaded' | 'initializing' | 'initialized' = 'unloaded';
  private _client: SignClient | null = null;
  // calls ping on connect, response times out the connection is probably terminated
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private modal: WalletConnectModal | null = null;
  public platform = 'kadena';
  public network: string | null = null;
  public likelyInvalidSession: boolean | null = null;
  public kadenaAccounts: Record<string, KadenaAccount[] | undefined> = {};
  public onConnect = Evt.create<string>();
  public onDisconnect = Evt.create<void>();
  public onUpdate = Evt.create<void>();
  // Pass through all events for testing purposes
  public onEvent = Evt.create<ClientEvents>();

  public constructor() {
    this.onConnect.attach(() => {
      const networks = this.getNetworks();
      this.network = networks.find((x) => x.includes('test')) ?? networks[0];
    });
    this.onEvent.$attach(to('proposal_expire'), (data) => {
      const expire = new Date((data as { id: number }).id / 1000);
      console.log('expire', expire);
      if (expire.getTime() < Date.now()) {
        console.warn('! Proposal expired !');
        this.likelyInvalidSession = true;
        this.onUpdate.post();
      }
    });
  }

  public get state() {
    return this._state;
  }

  public get client() {
    if (!this._client) {
      throw Error(
        'Client is not initialized. Call `await client.init()` first',
      );
    }
    return this._client;
  }

  public async init({
    projectId,
    relayUrl,
  }: {
    projectId: string;
    relayUrl: string;
  }) {
    if (this._state !== 'unloaded') return;
    this._state = 'initializing';

    const { SignClient } = await import('@walletconnect/sign-client');
    this._client = await SignClient.init({
      relayUrl,
      projectId,
    });

    CLIENT_EVENTS.forEach((event) => {
      this.client?.on(event, (data) => {
        this.onEvent.post([event, data]);
      });
    });

    // Init modal
    this.modal = await createModalInstance(projectId);

    await this.loadExistingConnection();

    // Keep testing session on interval, it can be terminated at any time
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => {
        this.testSession().catch(console.error);
      }, 10_000);
    }

    this._state = 'initialized';
    this.onUpdate.post();
    //
  }

  public async loadExistingConnection() {
    const topic = this.sessionTopic();
    if (topic) {
      console.warn('onconnect post - loadExistingConnection');
      this.onConnect.post(topic);
      // await this.testSession();
    }
  }

  public async testSession() {
    const topic = this.sessionTopic();
    if (topic === null) return;
    const result = await Promise.race([
      this.client?.ping({ topic }).then(() => 'ok'),
      timeout('timeout', 1000),
    ]);

    if (result === 'ok') {
      if (this.likelyInvalidSession !== false) {
        this.likelyInvalidSession = false;
        this.onUpdate.post();
      }
    } else if (result === 'timeout') {
      if (this.likelyInvalidSession !== true) {
        this.likelyInvalidSession = true;
        this.onUpdate.post();
      }
    } else {
      console.warn('unknown ping reponse', result);
    }
  }

  public sessionTopic() {
    if (!this._client) return null;
    const sessionKey = this._client.session.keys.at(-1) ?? null;
    const session = sessionKey ? this._client.session.get(sessionKey) : null;
    // console.log(session);
    return session?.topic ?? null;
  }

  public getNamespaceKadena() {
    const topic = this.sessionTopic();
    const session = topic && this.client?.session.get(topic);
    if (!session) return null;
    return session.namespaces.kadena as {
      accounts: string[];
      chains: string[];
      events: string[];
      methods: string[];
    };
  }

  public setNetwork(network: string) {
    this.network = network;
    this.kadenaAccounts = {};
    this.onUpdate.post();
  }

  public getNetworks() {
    const kadena = this.getNamespaceKadena();
    if (!kadena) return [];
    console.log('kadena', kadena);
    const accounts = kadena.chains || kadena.accounts;
    return accounts.reduce((memo, string) => {
      const [platform, network] = string.split(':');
      if (platform !== this.platform) return memo;
      return memo.concat(network);
    }, [] as string[]);
  }

  public getAccounts() {
    const kadena = this.getNamespaceKadena();
    if (!kadena) return [];
    return kadena.accounts.reduce((memo, string) => {
      const [platform, network, account] = string.split(':');
      if (platform !== this.platform || network !== this.network) return memo;
      return memo.concat(account);
    }, [] as string[]);
  }

  public async disconnect() {
    const session = this.sessionTopic();
    if (session) {
      await this.client?.disconnect({
        topic: session,
        reason: CLIENT_ERRORS.USER_DISCONNECTED,
      });
      this.kadenaAccounts = {};
      this.likelyInvalidSession = null;
      this.onDisconnect.post();
    }
  }

  public async connect() {
    const response = await this.client.connect({
      pairingTopic: undefined,
      requiredNamespaces: {
        kadena: {
          methods: [
            'kadena_getAccounts_v1',
            'kadena_sign_v1',
            'kadena_quicksign_v1',
          ],
          chains: [
            'kadena:mainnet01',
            'kadena:testnet04',
            'kadena:development',
          ],
          events: [],
        },
      },
    });

    this.modal?.openModal({ uri: response.uri }).catch(console.error);

    // Wait for approval (this can take a while)
    const session = await response.approval();
    this.modal?.closeModal();
    console.warn('onconnect post - connect');
    this.onConnect.post(session.topic);
  }

  public async fetchKadenaAccounts(inputAccount: string) {
    const clientAccount = `${this.platform}:${this.network}:${inputAccount}`;
    console.log('fetchKadenaAccounts', clientAccount);
    const topic = this.sessionTopic();
    if (!topic) return;

    if (!this.getNamespaceKadena()?.accounts.includes(clientAccount)) {
      throw Error('Invalid account');
    }

    const [chain, network, account] = clientAccount.split(':');
    console.log('request', { chain, network, account });
    const response = await this.client.request<{
      accounts: {
        kadenaAccounts: KadenaAccount[];
      }[];
    }>({
      topic,
      chainId: `${chain}:${network}`,
      request: getAccountsRequest(clientAccount),
    });
    console.log('kadenaAccounts response', response);
    // return;
    this.kadenaAccounts[account] = response.accounts.flatMap((account) =>
      account.kadenaAccounts.map((_account) => ({
        chains: _account.chains,
        contract: _account.contract,
        name: _account.name,
      })),
    );
    console.log('this.kadenaAccounts', this.kadenaAccounts);
    this.onUpdate.post();
    // console.log('response', response);
  }

  public unmount() {
    // a hook unmounts, there can be multiple hooks
    console.log('unmount', this.updateInterval);
    // this.modal?.closeModal();
    // if (this.updateInterval) {
    //   clearInterval(this.updateInterval);
    // }
  }
}

export const createClient = () => {
  const client = new WalletConnectClient();
  return client;
};
