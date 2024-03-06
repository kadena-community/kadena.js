export function getTransactionsQuery(accountName: string) {
  return {
    query: `query getTransactions($accountName: String) {
      transactions(
        accountName: $accountName
      ) {
        totalCount
        edges {
          node {
            id
            hash
            cmd {
              meta {
                chainId
                gasLimit
                gasPrice
                sender
                ttl
              }
              payload {
                ... on ExecutionPayload {
                  data
                  code
                }
                ... on ContinuationPayload {
                  data
                  pactId
                  proof
                  rollback
                }
              }
              signers {
                id
                requestKey
                publicKey
                capabilities
              }
            }
            result {
              continuation
              eventCount
              gas
            }
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
            events {
              requestKey
              parameterText
              id
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
