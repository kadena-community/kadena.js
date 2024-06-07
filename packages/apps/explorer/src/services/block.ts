import type { NewBlocksSubscriptionResult } from '@/__generated__/sdk';

export type BlockData = Omit<NewBlocksSubscriptionResult['data'], '__typename'>;

export interface IHeightBlock {
  [height: number]: BlockData;
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

    data[block.chainId][block.height] = block;
  }

  return data;
}
