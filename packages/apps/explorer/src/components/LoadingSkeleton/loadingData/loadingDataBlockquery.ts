import type { BlockQuery } from '@/__generated__/sdk';

export const loadingData: BlockQuery = {
  block: {
    chainId: 0,
    creationTime: new Date().toLocaleString(),
    difficulty: 0,
    epoch: new Date().toLocaleString(),
    flags: 0,
    hash: '0',
    height: 0,
    id: '0',
    minerAccount: {
      accountName: '',
      guard: {
        predicate: '',
        keys: ['0'],
        raw: '',
      },
    },
    neighbors: [
      {
        chainId: '0',
        hash: '',
      },
      {
        chainId: '1',
        hash: '',
      },
    ],
    nonce: 0,
    parent: {
      hash: '',
    },
    payloadHash: '',
    powHash: '',
    target: 0,
    weight: 0,
    transactions: {
      totalCount: 0,
    },
  },
};
