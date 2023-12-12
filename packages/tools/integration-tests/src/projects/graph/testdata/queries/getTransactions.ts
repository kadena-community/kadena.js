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
            continuation
            pactId
            proof
            rollback
            transfers {
              amount
              chainId
              id
              receiverAccount
              requestKey
              senderAccount
              crossChainTransfer {
                amount
                blockHash
                chainId
                id
                moduleName
                receiverAccount
                requestKey
                senderAccount
              }
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

export function getTransactionsByRequestKeyQuery(
  requestKey: string | undefined,
) {
  return {
    query: `query getTransactionsByRequestKey($requestKey: String!) {
      transactions(requestKey: $requestKey) {
        edges {
          node {
            block {
              hash
            }
          }
        }
      }
    }`,
    variables: { requestKey: requestKey },
    operationName: 'getTransactionsByRequestKey',
    extensions: {},
  };
}
