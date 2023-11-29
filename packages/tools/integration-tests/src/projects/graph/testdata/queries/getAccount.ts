export function getAccountQuery(account: string) {
  return {
    query: `query getAccount($moduleName: String!, $accountName: String!) {
      account(moduleName: $moduleName, accountName: $accountName) {
        ...AllAccountFields
        chainAccounts {
          ...CoreChainAccountFields
          guard {
            keys
            predicate
            __typename
          }
          __typename
        }
        transactions {
          edges {
            node {
              ...CoreTransactionFields
              __typename
            }
            __typename
          }
          __typename
        }
        transfers {
          edges {
            node {
              ...CoreTransferFields
              crossChainTransfer {
                ...CoreTransferFields
                __typename
              }
              transaction {
                pactId
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
    }

    fragment AllAccountFields on ModuleAccount {
      ...CoreAccountFields
      id
      totalBalance
      __typename
    }

    fragment CoreAccountFields on ModuleAccount {
      accountName
      moduleName
      __typename
    }

    fragment CoreChainAccountFields on ChainModuleAccount {
      balance
      chainId
      __typename
    }

    fragment CoreTransactionFields on Transaction {
      chainId
      code
      creationTime
      height
      requestKey
      __typename
    }

    fragment CoreTransferFields on Transfer {
      amount
      chainId
      senderAccount
      height
      requestKey
      receiverAccount
      __typename
    }`,
    variables: { moduleName: 'coin', accountName: account },
    operationName: 'getAccount',
    extensions: {},
  };
}
