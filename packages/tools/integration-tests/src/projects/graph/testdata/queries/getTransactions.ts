export function getTransactionsQuery(accountName: string) {
  return {
    query: `query getTransactions($accountName: String) {
      transactions(
        accountName: $accountName
      ) {
        totalCount
        edges {
          node {
            code
            data
            gas
            gasLimit
            gasPrice
            id
            senderAccount
            transfers {
              amount
              chainId
              id
              receiverAccount
              requestKey
              senderAccount
            }
            ttl
            chainId
            requestKey
            eventCount
            events {
              requestKey
              parameterText
              id
            }
            signers {
              capabilities
              id
              publicKey
              requestKey
            }
          }
        }
      }
    }`,
    variables: { accountName: accountName },
    operationName: 'getTransactions',
    extensions: {},
  };
}


export function getxChainTransactionsQuery(accountName: string) {
  return {
    query: `query getxChainTransactionsQuery($accountName: String) {
      transactions(
        accountName: $accountName
      ) {
        totalCount
        edges {
          node {
            chainId
            code
            continuation
            data
            gas
            gasLimit
            gasPrice
            id
            senderAccount
            transfers {
              amount
              chainId
              id
              receiverAccount
              requestKey
              senderAccount
            }
            step
            ttl
            requestKey
            eventCount
            events {
              chainId
              requestKey
              parameterText
              id
            }
            signers {
              capabilities
              id
              publicKey
              requestKey
            }
          }
        }
      }
    }`,
    variables: { accountName: accountName },
    operationName: 'getxChainTransactionsQuery',
    extensions: {},
  };
}
