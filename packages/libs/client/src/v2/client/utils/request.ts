const getApiHost = (
  network: 'mainnet' | 'testnet',
  chainId: string,
  apiVersion: string = '0.0',
): string => {
  const networkSubDomain = network === 'mainnet' ? '' : '.testnet';
  const networkId = network === 'mainnet' ? 'mainnet01' : 'testnet04';
  return `https://api.${networkSubDomain}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
};

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
  params?: Record<string, string | undefined | boolean | number>,
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

export interface ICommandRequest {
  cmd: string;
  hash: string;
  sigs: string[];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function request<Body extends object, ResponseType extends object>(
  type: 'poll' | 'local' | 'send',
) {
  return async (host: string, body: Body): Promise<ResponseType> => {
    const request = jsonRequest(body);
    const url = getUrl(host, `api/v1/${type}`);

    try {
      const response = await fetch(url, request);
      return await parseResponse(response);
    } catch (error) {
      console.error(`An error occurred while calling ${type} API:`, error);
      throw error;
    }
  };
}
