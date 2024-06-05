import { NewBlocksSubscriptionResult } from '@/__generated__/sdk';

interface IHeightBlock {
  height: number;
  data: NewBlocksSubscriptionResult['data'];
}

interface IChainBlock {
  chainId: number;
  blocks: IHeightBlock[];
}

export function formatBlockRows(dataStructure: ): {
  chainId: number;
  blocks: { height: number; data: NewBlocksSubscriptionResult['data'] }[];
} {
  const blocks: {
    chainId: number;
    blocks: { height: number; data: NewBlocksSubscriptionResult['data'] }[];
  } = {
    chainId: 0,
    blocks: [],
  };

  return blocks;
}
