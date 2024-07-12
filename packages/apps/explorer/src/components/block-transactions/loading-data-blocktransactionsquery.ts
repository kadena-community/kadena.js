import type { BlockTransactionsQuery } from '@/__generated__/sdk';

export const loadingData: BlockTransactionsQuery = {
  __typename: 'Query',
  node: {
    hash: '',
    __typename: 'Block',
    transactions: {
      __typename: 'BlockTransactionsConnection',
      pageInfo: {
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
      },
      totalCount: 0,
      edges: Array(10).fill({
        cursor: '',
        node: {
          id: '',
          hash: '',
          result: {
            goodResult: '',
          },
          cmd: {
            meta: {
              sender: '',
            },
            payload: {
              code: '',
            },
          },
        },
      }),
    },
  },
};
