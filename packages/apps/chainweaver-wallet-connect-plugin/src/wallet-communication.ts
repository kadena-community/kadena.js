export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface KadenaAccount {
  name: string;
  contract: string;
  chains: number[];
}

export interface AccountResponse {
  account: string;
  publicKey: string;
  kadenaAccounts: KadenaAccount[];
}

export interface IAccount {
  uuid: string;
  networkUUID: any;
  profileId: string;
  contract: string;
  address: string;
  overallBalance: string;
  chains: Array<{
    chainId: any;
    balance: string;
  }>;
  guard: any;
  keysetId?: string;
  alias?: string;
  syncTime?: number;
}

export interface INetwork {
  uuid: UUID;
  networkId: string;
  name?: string;
  default?: boolean;
  disabled?: boolean;
  faucetContract?: string;
  hosts: Array<{
    url: string;
    submit: boolean;
    read: boolean;
    confirm: boolean;
  }>;
}

export interface IQuickSignResponseSuccess {
  commandSigData: {
    cmd: string,
    sigs: Array<{ pubKey: string; sig: string | null; }>
  },
  outcome: {
    result: "success" | "failure" | "noSig",
    hash?: string,
    msg?: string;
  }
}

export interface IQuickSignResponseError {
  error: {
    type: "reject" | "emptyList" | "other",
    msg?: string
  }
}

export type QuickSignResponse = IQuickSignResponseSuccess | IQuickSignResponseError;

export interface ISignResponse {
  status: string;
  transaction: {
    cmd: string;
    hash: string;
    sigs: Array<{ pubKey: string; sig: string | null; }>
  };
}

interface ResponsePayload {
  GET_ACCOUNTS: Array<IAccount>;
  GET_NETWORK_LIST: INetwork[];
  SIGN_REQUEST: ISignResponse;
}

interface IResponseType<T extends MessageType> {
  id: string;
  type: string;
  payload: ResponsePayload[T];
  error: unknown;
}

type MessageType = 'GET_ACCOUNTS' | 'GET_NETWORK_LIST' | 'SIGN_REQUEST';

export const communicate =
  (client: Window, server: Window, pluginId: string, sessionId: string) =>
  <T extends MessageType>(
    type: MessageType,
    payload?: Record<string, unknown>,
  ): Promise<IResponseType<T>> => {
    const id = `${pluginId}:${crypto.randomUUID()}`;
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        console.log('event', event);
        if (event.data && event.data.id === id) {
          client.removeEventListener('message', handler);
          resolve(event.data);
        }
      };
      client.addEventListener('message', handler);
      server.postMessage({ payload, id, sessionId, type, pluginId }, '*');
    });
  };
