import { graphql } from '../../gql/gql.js';

export const TRANSFER_FIELDS_FRAGMENT = graphql(`
  fragment TransferFields on Transfer {
    amount
    chainId
    orderIndex
    receiverAccount
    requestKey
    senderAccount
    moduleName
    block {
      hash
      height
      creationTime
    }
    transaction {
      cmd {
        networkId
        payload {
          __typename
          ... on ExecutionPayload {
            code
            data
          }
          ... on ContinuationPayload {
            step
            pactId
          }
        }
        signers {
          clist {
            name
            args
          }
        }
      }
      result {
        __typename
        ... on TransactionResult {
          goodResult
          badResult
          events {
            edges {
              node {
                name
                parameters
              }
            }
          }
        }
      }
    }
  }
`);

export const ACCOUNT_TRANSFER_QUERY = graphql(`
  query accountTransfers(
    $accountName: String!
    $fungibleName: String
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    lastBlockHeight
    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {
      transfers(first: $first, last: $last, before: $before, after: $after) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            ...TransferFields
            crossChainTransfer {
              ...TransferFields
            }
          }
        }
      }
    }
  }
`);

export const ACCOUNT_CHAIN_TRANSFER_QUERY = graphql(`
  query accountChainTransfers(
    $accountName: String!
    $chainId: String
    $fungibleName: String
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    lastBlockHeight
    transfers(
      accountName: $accountName
      chainId: $chainId
      fungibleName: $fungibleName
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...TransferFields
          crossChainTransfer {
            ...TransferFields
          }
        }
      }
    }
  }
`);

export const TRANSFER_REQUESTKEY_QUERY = graphql(`
  query accountTransferRequestKey($requestKey: String!, $accountName: String) {
    lastBlockHeight
    transfers(requestKey: $requestKey, accountName: $accountName) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...TransferFields
        }
      }
    }
  }
`);
