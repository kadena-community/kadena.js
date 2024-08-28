import type { AccountTransfersQuery } from '@/__generated__/sdk';

export const loadingData: AccountTransfersQuery = {
  __typename: 'Query',
  node: {
    __typename: 'FungibleAccount',
    transfers: {
      pageInfo: {
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
      },
      totalCount: 0,
      edges: Array(6).fill({
        node: {
          requestKey: '0',
          blockHash: '0',
          amount: 0,
          chainId: 0,
          receiverAccount: '0',
          senderAccount: '0',
          height: 1,
        },
      }),
    },
  },
};
