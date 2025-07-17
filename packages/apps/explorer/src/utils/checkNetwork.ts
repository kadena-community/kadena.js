import type { INetwork } from '@/constants/network';

export const checkNetwork = (
  graphUrl: string,
  headers: INetwork['headers'] = {},
): Promise<Response> =>
  fetch(graphUrl, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      accept:
        'application/graphql-response+json, application/json, multipart/mixed',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'x-api-key': 'DKdA23Pky4K7men6DNSp8UvCoJI8eDh2uxoVQcH7',
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
