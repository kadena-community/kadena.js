export function getTransactionsQuery(accountName: string) {
  return {
    query: `query getTransactions($accountName: String) {
      transactions(accountName: $accountName) {
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
                pubkey
                clist {
                  args
                  name
                }
              }
            }
            result {
              ... on TransactionResult {
                continuation
                eventCount
                gas
                transfers {
                  edges {
                    node {
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
                  }
                }
                events {
                  edges {
                    node {
                      requestKey
                      parameterText
                      id
                    }
                  }
                }
              }
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
            result {
              ... on TransactionResult {
                block {
                  hash
                }
              }
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

export function getTransactionsByRequestKeySubscription(
  requestKey: string | undefined,
  chainId: string,
) {
  return {
    query: `subscription tx($requestKey: String! $chainId: String!) {
                transaction(requestKey: $requestKey chainId: $chainId){
                  result {
                    __typename
                    ... on TransactionMempoolInfo {
                      status
                    }
			              ...on TransactionResult {
                    badResult
                    goodResult 
                    }
                  }
                }
              }`,
    variables: { requestKey: requestKey, chainId: chainId },
    operationName: 'tx',
    extensions: {},
  };
}
