
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


interface ResponsePayload {
  GET_ACCOUNTS: Array<IAccount>;
}

interface IResponseType<T extends MessageType> {
  id: string;
  type: string;
  payload: ResponsePayload[T];
  error: unknown;
}

type MessageType = 'GET_ACCOUNTS';

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
      server.postMessage({ payload, id, sessionId, type }, '*');
    });
  };
