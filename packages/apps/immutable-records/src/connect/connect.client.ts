import { Evt } from 'evt';
import { WalletConnectModal, createModalInstance } from './connect.modal';
import {
  CLIENT_ERRORS,
  CLIENT_EVENTS,
  ClientEvents,
  getAccountsRequest,
  timeout,
} from './connect.utils';

export type SignClient = Awaited<
  ReturnType<
    Awaited<typeof import('@walletconnect/sign-client')>['SignClient']['init']
  >
>;

export type KadenaAccount = {
  name: string;
  contract: string;
  chains: string[];
};

export class WalletConnectClient {
  _client: SignClient | null = null;
  // calls ping on connect, response times out the connection is probably terminated
  likelyInvalidSession: boolean | null = null;
  updateInterval: ReturnType<typeof setInterval> | null = null;
  modal: WalletConnectModal | null = null;
  kadenaAccounts: Record<string, KadenaAccount[] | undefined> = {};
  onConnect = Evt.create<string>();
  onDisconnect = Evt.create<void>();
  onUpdate = Evt.create<void>();
  // Pass through all events for testing purposes
  onEvent = Evt.create<ClientEvents>();

  get client() {
    if (!this._client) {
      throw Error('Client is not initialized. Call init() first');
    }
    return this._client;
  }

  async init({ projectId, relayUrl }: { projectId: string; relayUrl: string }) {
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
    this.modal = await createModalInstance();

    await this.loadExistingConnection();

    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => {
        this.testSession();
      }, 10_000);
    }
  }

  async loadExistingConnection() {
    const topic = this.sessionTopic();
    if (topic) {
      this.onConnect.post(topic);
      await this.testSession();
    }
  }

  async testSession() {
    const topic = this.sessionTopic();
    if (!topic) return;
    const result = await Promise.race([
      this.client?.ping({ topic }).then(() => 'ok'),
      timeout('timeout', 1000),
    ]);

    if (result === 'ok') {
      this.likelyInvalidSession = false;
      this.onUpdate.post();
    } else if (result === 'timeout') {
      this.likelyInvalidSession = true;
      this.onUpdate.post();
    } else {
      console.warn('unknown ping reponse', result);
    }
  }

  sessionTopic() {
    if (!this._client) return null;
    const sessionKey = this.client.session.keys.at(-1) ?? null;
    const session = sessionKey ? this.client.session.get(sessionKey) : null;
    // console.log(
    //   `sessionTopic keys: ${this.client.session.keys.length}, last: ${sessionKey}`,
    // );
    return session?.topic ?? null;
  }

  getNamespaceKadena() {
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

  getAccounts() {
    const kadena = this.getNamespaceKadena();
    return kadena ? kadena.accounts : [];
  }

  async disconnect() {
    const session = this.sessionTopic();
    if (session) {
      await this.client?.disconnect({
        topic: session,
        reason: CLIENT_ERRORS.USER_DISCONNECTED,
      });
      this.likelyInvalidSession = null;
      this.onDisconnect.post();
    }
  }

  async connect() {
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

    this.modal?.openModal({ uri: response.uri });

    // Wait for approval (this can take a while)
    const session = await response.approval();
    this.modal?.closeModal();
    this.onConnect.post(session.topic);
  }

  async getKadenaAccounts(account: string) {
    const topic = this.sessionTopic();
    if (!topic) return;

    if (!this.getAccounts().includes(account)) {
      throw Error('Invalid account');
    }

    const [chain, network] = account.split(':');
    const response = await this.client.request<{
      accounts: {
        kadenaAccounts: KadenaAccount[];
      }[];
    }>({
      topic,
      chainId: `${chain}:${network}`,
      request: getAccountsRequest(account),
    });
    this.kadenaAccounts[account] = response.accounts.flatMap((account) =>
      account.kadenaAccounts.map((_account) => ({
        chains: _account.chains,
        contract: _account.contract,
        name: _account.name,
      })),
    );
    this.onUpdate.post();
    // console.log('response', response);
  }

  unmount() {
    this.modal?.closeModal();
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

export const createClient = () => {
  const client = new WalletConnectClient();
  return client;
};
