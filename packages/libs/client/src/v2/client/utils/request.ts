// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const jsonRequest = (body: object) => ({
  headers: {
    'Content-Type': 'application/json' as const,
  },
  method: 'POST' as const,
  body: JSON.stringify(body),
});

export async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json();
  } else {
    try {
      const textResponse: string = await response.text();
      return Promise.reject(new Error(textResponse));
    } catch (error) {
      return response as T;
    }
  }
}

export function getUrl(
  host: string,
  endpoint: string,
  params?: object,
): string {
  const urlStr = `${host}${
    endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  }`;
  const url = new URL(urlStr);

  if (params !== undefined) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return url.toString();
}

export const kadenaHostGenerator = (networkId: string, chainId: string) => {
  switch (networkId) {
    case 'mainnet01':
      return `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    case 'testnet04':
      return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    default:
      throw new Error(`UNKNOWN_NETWORK_ID: ${networkId}`);
  }
};

export interface ICommandRequest {
  cmd: string;
  hash: string;
  sigs: string[];
}

export interface INetworkOptions {
  networkId: string;
  chainId: string;
}

export interface IPollOptions {
  onTry?: (counter: number) => void;
  timeout?: number;
  interval?: number;
}
