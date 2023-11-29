export function getTransactionsQuery(amount = 1) {
  return {
    query: `query getTransactions($moduleName: String, $accountName: String, $chainId: String, $blockHash: String, $after: String, $before: String, $first: Int, $last: Int) {
      transactions(
        moduleName: $moduleName
        accountName: $accountName
        chainId: $chainId
        blockHash: $blockHash
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
          __typename
        }
        edges {
          cursor
          node {
            ...CoreTransactionFields
            block {
              hash
              __typename
            }
            signers {
              publicKey
              signature
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
    }

    fragment CoreTransactionFields on Transaction {
      chainId
      code
      creationTime
      height
      requestKey
      __typename
    }`,
    variables: { first: amount},
    operationName: 'getTransactions',
    extensions: {},
  };
}
