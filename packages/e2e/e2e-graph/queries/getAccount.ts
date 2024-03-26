export function getAccountQuery(accountName: string) {
  return {
    query: `query getAccount($fungibleName: String!, $accountName: String!) {
      fungibleAccount(fungibleName: $fungibleName, accountName: $accountName) {
        ...AllAccountFields
        chainAccounts {
          ...CoreChainAccountFields
          guard {
            keys
            predicate
          }
        }
        transactions {
          edges {
            node {
              ...CoreTransactionFields
            }
          }
        }
        transfers {
          edges {
            node {
              ...CoreTransferFields
              crossChainTransfer {
                ...CoreTransferFields
              }
              transaction {
                cmd{
                  payload {
                    ... on ContinuationPayload {
                      pactId
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    fragment AllAccountFields on FungibleAccount {
      ...CoreAccountFields
      id
      totalBalance
    }
    fragment CoreAccountFields on FungibleAccount {
      accountName
      fungibleName
    }
    fragment CoreChainAccountFields on FungibleChainAccount {
      balance
      chainId
    }
    fragment CoreTransactionFields on Transaction {
      hash
      cmd {
        meta {
          chainId
          creationTime
        }
        payload {
          ... on ExecutionPayload {
            code
          }
        }
      }
      result {
        ... on TransactionResult {
          height
        }
      }
    }
    fragment CoreTransferFields on Transfer {
      amount
      chainId
      senderAccount
      height
      requestKey
      receiverAccount
    }`,
    variables: { fungibleName: 'coin', accountName: accountName },
    operationName: 'getAccount',
    extensions: {},
  };
}
