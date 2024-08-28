import type {
  BlocksFromHeightQueryResult,
  CompletedBlockHeightsQueryResult,
  NewBlocksSubscriptionResult,
} from '@/__generated__/sdk';

export interface IBlockData {
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
    | BlocksFromHeightQueryResult['data']
    | CompletedBlockHeightsQueryResult['data'],
): IChainBlock {
  const updatedData = { ...existingData };

  if (!newData) return updatedData;

  const addBlock = (block: any) => {
    if (!updatedData[block.chainId]) {
      updatedData[block.chainId] = {};
    }

    updatedData[block.chainId][block.height] = {
      ...block,
      txCount: block.transactions.totalCount,
    };
  };

  if ('newBlocks' in newData) {
    if (!newData.newBlocks) return updatedData;

    for (const block of newData.newBlocks) {
      addBlock(block);
    }
  } else if ('blocksFromHeight' in newData) {
    if (!newData.blocksFromHeight) return updatedData;

    for (const block of newData.blocksFromHeight.edges) {
      if (!block?.node) {
        continue;
      }

      addBlock(block.node);
    }
  } else if ('completedBlockHeights' in newData) {
    if (!newData.completedBlockHeights) return updatedData;

    for (const block of newData.completedBlockHeights.edges) {
      if (!block?.node) {
        continue;
      }

      addBlock(block.node);
    }
  }

  return updatedData;
}
