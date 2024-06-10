import type { NewBlocksSubscriptionResult } from '@/__generated__/sdk';

interface IBlockData {
  hash: string;
  height: number;
  chainId: number;
  difficulty: string;
  txCount: number;
}

export interface IHeightBlock {
  [height: number]: IBlockData;
}

export interface IChainBlock {
  [chainId: number]: IHeightBlock;
}

export function addBlockData(
  existingData: IChainBlock,
  newData: NewBlocksSubscriptionResult['data'],
): IChainBlock {
  const data = { ...existingData };

  if (!newData?.newBlocks) return data;

  for (const block of newData.newBlocks) {
    if (!block) {
      continue;
    }

    if (!data[block.chainId]) {
      data[block.chainId] = {};
    }

    data[block.chainId][block.height] = {
      ...block,
      txCount: block.transactions.totalCount,
    };
  }

  return data;
}
