import { getSdk } from '@/__generated__/sdk-node';
import { env } from '@/utils/env';
import { store } from '@/utils/socket/store';
import { GraphQLClient } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';

interface IResponseData {
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>,
) {
  const accounts = await store.getAllAccounts();
  if (!accounts) {
    return res.status(404).json({
      message: 'no accounts found',
    });
  }

  const client = new GraphQLClient(env.GRAHQLURL);

  const promises = Object.entries(accounts).map(([key, value]) =>
    getSdk(client).GetTokens({
      accountName: value.accountName ?? '',
    }),
  );

  const results = await Promise.all(promises);

  const newAccounts = results.map((data, idx: number) => {
    const account = accounts[idx];
    if (!data) return account;
    return {
      ...account,
      tokenCount: data.nonFungibleAccount?.nonFungibles.length ?? 0,
    };
  });

  store.saveLeaderboardAccounts(newAccounts);

  res.status(200).json({ message: 'success' });
}
