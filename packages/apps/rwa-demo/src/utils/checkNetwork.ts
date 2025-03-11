import { env } from './env';

export const checkNetwork = (graphUrl: string): Promise<Response> =>
  fetch(graphUrl, {
    method: 'POST',
    headers: {
      'x-api-key': env.GRAPHAPIKEY,
      'bypass-tunnel-reminder': env.GRAPHURL,
      accept:
        'application/graphql-response+json, application/json, multipart/mixed',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
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
