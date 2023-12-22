export function getAccountQuery(accountName: string) {
  return {
    query: `query getAccount($moduleName: String!, $accountName: String!) {
      account(moduleName: $moduleName, accountName: $accountName) {
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
                pactId
              }
            }
          }
        }
      }
    }
    fragment AllAccountFields on ModuleAccount {
      ...CoreAccountFields
      id
      totalBalance
    }
    fragment CoreAccountFields on ModuleAccount {
      accountName
      moduleName
    }
    fragment CoreChainAccountFields on ChainModuleAccount {
      balance
      chainId
    }
    fragment CoreTransactionFields on Transaction {
      chainId
      code
      creationTime
      height
      requestKey
    }
    fragment CoreTransferFields on Transfer {
      amount
      chainId
      senderAccount
      height
      requestKey
      receiverAccount
    }`,
    variables: { moduleName: 'coin', accountName: accountName },
    operationName: 'getAccount',
    extensions: {},
  };
}
