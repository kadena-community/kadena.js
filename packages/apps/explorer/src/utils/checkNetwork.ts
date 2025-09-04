import type { INetwork } from '@/constants/network';

export const checkNetwork = (
  graphUrl: string,
  headers: INetwork['headers'] = {},
): Promise<Response> => {
  console.log(graphUrl, headers);

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

// const res = fetch("https://api.mainnet.kadindexer.io/v0/", {
//     'method': 'POST',
//     'mode': 'cors',
//     'credentials': 'omit',
//     'headers': {
//       'accept': 'application/json',
//       'content-type': 'application/json',
//       'sec-fetch-dest': 'empty',
//       'sec-fetch-mode': 'cors',
//       'sec-fetch-site': 'cross-site',
//       'x-api-key': 'DKdA23Pky4K7men6DNSp8UvCoJI8eDh2uxoVQcH7'
//     },
//     'body': JSON.stringify({
//       query: `query networkInfo {
//                   networkInfo {
//                     totalDifficulty
//                     networkId
//                   }
//                 }`,
//       variables: {},
//       operationName: 'networkInfo',
//       extensions: {},
//     })})
