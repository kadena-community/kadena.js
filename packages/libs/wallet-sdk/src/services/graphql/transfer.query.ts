import { graphql } from '../../gql/gql.js';

export const TRANSFER_QUERY = graphql(`
  query accountTransfers($accountName: String!, $fungibleName: String) {
    lastBlockHeight
    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {
      transfers(first: 100) {
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
  fragment TransferFields on Transfer {
    amount
    chainId
    orderIndex
    receiverAccount
    requestKey
    senderAccount
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
