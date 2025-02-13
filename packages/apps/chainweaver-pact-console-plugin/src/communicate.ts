import { INetwork } from './network';

interface ResponsePayload {
  GET_NETWORK_LIST: INetwork[];
}

interface IResponseType<T extends MessageType> {
  id: string;
  type: string;
  payload: ResponsePayload[T];
  error: unknown;
}

type MessageType = 'GET_NETWORK_LIST';

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
