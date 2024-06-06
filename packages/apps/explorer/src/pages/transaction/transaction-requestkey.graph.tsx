import { gql } from '@apollo/client';

import type { DocumentNode } from 'graphql';

export const transactionRequestKey: DocumentNode = gql`
  query transactionRequestKey($requestKey: String!) {
    transaction(requestKey: $requestKey) {
      id
      hash
      sigs {
        sig
      }
      cmd {
        payload {
          __typename
          ... on ExecutionPayload {
            data
            code
          }
          ... on ContinuationPayload {
            data
            pactId
            proof
            rollback
            step
          }
        }
        meta {
          chainId
          gasLimit
          gasPrice
          sender
          ttl
          creationTime
        }
        networkId
        nonce
        signers {
          pubkey
          clist {
            args
            name
          }
          scheme
        }
      }

      result {
        ... on TransactionResult {
          goodResult
          badResult
          transactionId
          logs
          gas
          block {
            height
            hash
            creationTime
          }
          metadata
          continuation
          events {
            edges {
              node {
                qualifiedName
                parameters
              }
            }
          }
          transfers {
            edges {
              node {
                crossChainTransfer {
                  requestKey
                  senderAccount
                  receiverAccount
                }
              }
            }
          }
        }
      }
    }
  }
`;
