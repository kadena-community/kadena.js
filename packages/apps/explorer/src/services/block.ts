import type {
  BlocksFromHeightsQueryResult,
  NewBlocksSubscriptionResult,
} from '@/__generated__/sdk';

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
  newData:
    | NewBlocksSubscriptionResult['data']
    | BlocksFromHeightsQueryResult['data'],
): IChainBlock {
  const data = { ...existingData };

  if (!newData) return data;

  if ('newBlocks' in newData) {
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
  } else if ('blocksFromHeight' in newData) {
    if (!newData?.blocksFromHeight) return data;

    for (const block of newData.blocksFromHeight.edges) {
      if (!block?.node) {
        continue;
      }

      if (!data[block.node.chainId]) {
        data[block.node.chainId] = {};
      }

      data[block.node.chainId][block.node.height] = {
        ...block.node,
        txCount: block.node.transactions.totalCount,
      };
    }
  }

  return data;
}
