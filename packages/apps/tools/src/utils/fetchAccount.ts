import type { IAccount, INETWORK } from '@/app/api/alerts/utils/constants';

export const fetchAccount = async (
  network: INETWORK,
  account?: string,
): Promise<IAccount> => {
  if (!account)
    return {
      errors: [{ message: 'No account given' }],
    };

  const result = await fetch(network.url, {
    method: 'POST',
    headers: {
      accept:
        'application/graphql-response+json, application/json, multipart/mixed',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      pragma: 'no-cache',
      'x-api-key': process.env.HACKACHAIN_APIKEY ?? '',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
    },
    body: JSON.stringify({
      query: `query xchain {
  fungibleAccount(accountName: "${account}"){
    chainAccounts {
      balance
      chainId
    }
  }
}`,
      variables: {},
      operationName: 'xchain',
      extensions: {},
    }),
  });

  const data = (await result.json()) as IAccount;
  return data;
};
