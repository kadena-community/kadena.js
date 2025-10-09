import type { INetwork } from '@/constants/network';

export const checkNetwork = (
  graphUrl: string,
  headers: INetwork['headers'] = {},
): Promise<Response> => {
  return fetch(graphUrl, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      ...headers,
    },
    body: JSON.stringify({
      query: `query networkInfo {
                  networkInfo {
                    totalDifficulty
                    networkId
                  }
                }`,
      variables: {},
      operationName: 'networkInfo',
      extensions: {},
    }),
  });
};
