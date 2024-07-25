import type { IChainBlock, IHeightBlock } from '@/services/block';

const array = Array.from(Array(20), (x, i) => i);

export const blockDataLoading = array.reduce((acc, val) => {
  acc[val] = {
    0: {
      chainId: 0,
      difficulty: '0',
      hash: '0',
      height: 0,
      txCount: 0,
    },
    1: {
      chainId: 0,
      difficulty: '0',
      hash: '0',
      height: 0,
      txCount: 0,
    },
    2: {
      chainId: 0,
      difficulty: '0',
      hash: '0',
      height: 0,
      txCount: 0,
    },
    3: {
      chainId: 0,
      difficulty: '0',
      hash: '0',
      height: 0,
      txCount: 0,
    },
  } as IHeightBlock;

  return acc;
}, {} as IChainBlock);
