export interface IResponseType<T extends unknown> {
  id: string;
  type: string;
  payload: T;
  error: unknown;
}

export const sleep = (time: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, time));

export const communicate =
  (client: Window, server: Window, walletOrigin: string) =>
  (
    type: string,
    payload: Record<string, unknown>,
  ): Promise<IResponseType<unknown>> => {
    const id = crypto.randomUUID();
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data && event.data.id === id) {
          client.removeEventListener('message', handler);
          resolve(event.data);
          server.blur();
          window.focus();
        }
      };
      client.addEventListener('message', handler);
      server.postMessage({ payload, id, type }, walletOrigin);
    });
  };

export const safeJsonParse = (jsonString: string): unknown => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};
