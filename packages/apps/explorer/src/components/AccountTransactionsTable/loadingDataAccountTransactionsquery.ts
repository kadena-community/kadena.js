import type { AccountTransactionsQuery } from '@/__generated__/sdk';

export const loadingData: AccountTransactionsQuery = {
  node: {
    transactions: {
      pageInfo: {
        endCursor: '',
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
      },
      edges: Array(6).fill({
        node: {
          hash: '',
          result: {
            block: {
              height: 0,
            },
            goodResult: '',
          },
          cmd: {
            meta: {
              sender: '',
              chainId: 0,
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
