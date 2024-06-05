import {
  BlocksFromHeightQuery,
  LastBlockHeightQuery,
} from '../generated/graphql';
import { BLOCKS_FROM_HEIGHT_QUERY } from './blocksFromHeight';
import { LAST_BLOCK_HEIGHT_QUERY } from './lastBlockHeight';
import { GET_TOKENS_QUERY } from './getTokens';

export const getBlocksFromHeight = async (
  height: number,
  after?: string | null,
) => {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: BLOCKS_FROM_HEIGHT_QUERY,
      variables: { startHeight: height, after, first: 50 },
    }),
  });

  const responseData: {
    data: BlocksFromHeightQuery;
    errors?: any[];
  } = await response.json();
  const { data, errors } = responseData;

  if (errors) {
    console.error('Error fetching data:', errors);
    return null;
  }

  return data.blocksFromHeight;
};

export const getLastBlockHeight = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: LAST_BLOCK_HEIGHT_QUERY,
    }),
  });

  const responseData: {
    data: LastBlockHeightQuery;
    errors?: any[];
  } = await response.json();
  const { data, errors } = responseData;

  if (errors) {
    console.error('Error fetching data:', errors);
    return null;
  }

  return Number(data.lastBlockHeight);
};


export type NonFungibleTokenBalance = {
  accountName: string
  balance: number
  chainId: string
  tokenId: string
};

export const getTokens = async (accountName: string): Promise<NonFungibleTokenBalance[]> => {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GET_TOKENS_QUERY,
      variables: { accountName },
    }),
  });

  const responseData = await response.json();
  const { data, errors } =  responseData;

  if (errors) {
    console.error('Error fetching data:', errors);
    return [];
  }

  const { nonFungibleAccount } = data;

  return nonFungibleAccount.nonFungibleTokenBalances;
}
