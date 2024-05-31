import axios from 'axios';
import {
  BlocksFromHeightQuery,
  LastBlockHeightQuery,
} from '../generated/graphql';
import { BLOCKS_FROM_HEIGHT_QUERY } from './blocksFromHeight';
import { LAST_BLOCK_HEIGHT_QUERY } from './lastBlockHeight';

export const getBlocksFromHeight = async (
  height: number,
  after?: string | null,
) => {
  const response = await axios.post<{
    data: BlocksFromHeightQuery;
    errors?: any[];
  }>(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
    {
      query: BLOCKS_FROM_HEIGHT_QUERY,
      variables: { startHeight: height, after, first: 50 },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const { data, errors } = response.data;

  if (errors) {
    console.error('Error fetching data:', errors);
    return null;
  }

  return data.blocksFromHeight;
};

export const getLastBlockHeight = async () => {
  const response = await axios.post<{
    data: LastBlockHeightQuery;
    errors?: any[];
  }>(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
    {
      query: LAST_BLOCK_HEIGHT_QUERY,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const { data, errors } = response.data;

  if (errors) {
    console.error('Error fetching data:', errors);
    return null;
  }

  return Number(data.lastBlockHeight);
};
