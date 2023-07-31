import { Evt } from 'evt';
import { WalletConnectModal, createModalInstance } from './connect.modal';

export type SignClient = Awaited<
  ReturnType<
    Awaited<typeof import('@walletconnect/sign-client')>['SignClient']['init']
  >
>;

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL;

const CLIENT_EVENTS = [
  'session_proposal',
  'session_update',
  'session_extend',
  'session_ping',
  'session_delete',
  'session_expire',
  'session_request',
  'session_request_sent',
  'session_event',
  'proposal_expire',
] as const;

type ClientEventTypes = (typeof CLIENT_EVENTS)[number];
type ClientEvents = [ClientEventTypes, unknown];

// https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes
const CLIENT_ERRORS = {
  USER_DISCONNECTED: { code: 6000, message: 'User disconnected.' },
};

export class WalletConnectClient {
  client: SignClient | null = null;
  modal: WalletConnectModal | null = null;
  onConnect = Evt.create<string>();
  onDisconnect = Evt.create<void>();
  // Pass through all events for testing purposes
  onEvent = Evt.create<ClientEvents>();

  async init() {
    if (!RELAY_URL || !PROJECT_ID) {
      throw Error(
        "Missing env vars 'NEXT_PUBLIC_RELAY_URL' and/or 'NEXT_PUBLIC_PROJECT_ID' ",
      );
    }

    // Init client
    const { SignClient } = await import('@walletconnect/sign-client');
    this.client = await SignClient.init({
      relayUrl: RELAY_URL,
      projectId: PROJECT_ID,
    });

    CLIENT_EVENTS.forEach((event) => {
      this.client?.on(event, (data) => {
        this.onEvent.post([event, data]);
      });
    });

    this.loadExistingConnection();

    // Init modal
    this.modal = await createModalInstance();
  }

  loadExistingConnection() {
    const topic = this.sessionTopic();
    if (topic) {
      this.onConnect.post(topic);
    }
  }

  sessionTopic() {
    if (!this.client) return null;
    const sessionKey = this.client.session.keys.at(-1) ?? null;
    const session = sessionKey ? this.client.session.get(sessionKey) : null;
    return session?.topic ?? null;
  }

  async disconnect() {
    const session = this.sessionTopic();
    if (session) {
      await this.client?.disconnect({
        topic: session,
        reason: CLIENT_ERRORS.USER_DISCONNECTED,
      });
      this.onDisconnect.post();
    }
  }

  async connect() {
    if (!this.client || !this.modal) throw Error('client not initialized');

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

    response.approval().then((session) => {
      this.modal?.closeModal();
      this.onConnect.post(session.topic);
    });

    this.modal.openModal({ uri: response.uri });
  }

  unmount() {
    this.modal?.closeModal();
  }
}

export const createClient = async () => {
  const client = new WalletConnectClient();
  return client;
};
