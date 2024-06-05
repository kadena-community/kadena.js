export const BLOCKS_FROM_HEIGHT_QUERY = `
  query blocksFromHeight($startHeight: Int!, $after: String, $first: Int) {
    blocksFromHeight(startHeight: $startHeight, after: $after, first: $first) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          height
          chainId
          creationTime
          transactions {
            edges {
              node {
                result {
                  ... on TransactionResult {
                    events {
                      edges {
                        node {
                          qualifiedName
                          parameters
                          requestKey
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
