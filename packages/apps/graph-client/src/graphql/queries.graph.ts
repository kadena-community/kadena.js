import { ALL_BLOCK_FIELDS } from './fields/block.graph';
import { ALL_EVENT_FIELDS, CORE_EVENT_FIELDS } from './fields/event.graph';
import { ALL_FUNGIBLE_ACCOUNT_FIELDS } from './fields/fungible-account.graph';
import {
  ALL_FUNGIBLE_CHAIN_ACCOUNT_FIELDS,
  CORE_FUNGIBLE_CHAIN_ACCOUNT_FIELDS,
} from './fields/fungible-chain-account.graph';
import { CORE_MINER_KEY_FIELDS } from './fields/miner-key.graph';
import { ALL_NON_FUNGIBLE_ACCOUNT_FIELDS } from './fields/non-fungible-account.graph';
import { CORE_NON_FUNGIBLE_CHAIN_ACCOUNT_FIELDS } from './fields/non-fungible-chain-account.graph';
import {
  ALL_TRANSACTION_FIELDS,
  CORE_TRANSACTION_FIELDS,
} from './fields/transaction.graph';
import { CORE_TRANSFER_FIELDS } from './fields/transfer.graph';

import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const getTransactionNode: DocumentNode = gql`
  ${ALL_TRANSACTION_FIELDS}
  ${CORE_EVENT_FIELDS}

  query getTransactionNode($id: ID!) {
    node(id: $id) {
      ... on Transaction {
        ...AllTransactionFields
        block {
          hash
        }
        events {
          ...CoreEventFields
        }
        cmd {
          signers {
            publicKey
            signature
          }
        }
      }
    }
  }
`;

export const getBlockNodes: DocumentNode = gql`
  query getBlockNodes($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Block {
        height
        hash
        chainId
        creationTime
        confirmationDepth
        transactions {
          totalCount
        }
      }
    }
  }
`;

export const getEventNodes: DocumentNode = gql`
  ${ALL_EVENT_FIELDS}

  query getEventNodes($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Event {
        ...AllEventFields
        block {
          id
        }
        transaction {
          hash
        }
      }
    }
  }
`;

export const getBlockFromHash: DocumentNode = gql`
  ${ALL_BLOCK_FIELDS}
  ${CORE_TRANSACTION_FIELDS}
  ${CORE_MINER_KEY_FIELDS}

  query getBlockFromHash(
    $hash: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    block(hash: $hash) {
      ...AllBlockFields
      transactions(after: $after, before: $before, first: $first, last: $last) {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            ...CoreTransactionFields
          }
        }
      }
      confirmationDepth
      minerAccount {
        guard {
          predicate
          keys
        }
      }
      parent {
        hash
      }
      events {
        edges {
          node {
            ...AllEventFields
          }
        }
      }
    }
  }
`;

export const getLastBlock: DocumentNode = gql`
  query getLastBlock {
    lastBlockHeight
  }
`;

export const getGraphConfiguration: DocumentNode = gql`
  query getGraphConfiguration {
    graphConfiguration {
      maximumConfirmationDepth
      minimumBlockHeight
    }
  }
`;

export const getFungibleAccount: DocumentNode = gql`
  ${ALL_FUNGIBLE_ACCOUNT_FIELDS}
  ${CORE_FUNGIBLE_CHAIN_ACCOUNT_FIELDS}
  ${CORE_TRANSACTION_FIELDS}
  ${CORE_TRANSFER_FIELDS}

  query getFungibleAccount($fungibleName: String!, $accountName: String!) {
    fungibleAccount(fungibleName: $fungibleName, accountName: $accountName) {
      ...AllFungibleAccountFields
      chainAccounts {
        ...CoreFungibleChainAccountFields
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
            creationTime
            crossChainTransfer {
              ...CoreTransferFields
            }
            transaction {
              cmd {
                payload {
                  ... on ContPayload {
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
`;

export const getFungibleChainAccount: DocumentNode = gql`
  ${CORE_TRANSACTION_FIELDS}
  ${CORE_TRANSFER_FIELDS}
  ${ALL_FUNGIBLE_CHAIN_ACCOUNT_FIELDS}

  query getFungibleChainAccount(
    $fungibleName: String!
    $accountName: String!
    $chainId: String!
  ) {
    fungibleChainAccount(
      fungibleName: $fungibleName
      accountName: $accountName
      chainId: $chainId
    ) {
      ...AllFungibleChainAccountFields
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
            creationTime
            crossChainTransfer {
              ...CoreTransferFields
            }
            transaction {
              cmd {
                payload {
                  ... on ContPayload {
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
`;

export const getTransactions: DocumentNode = gql`
  ${CORE_TRANSACTION_FIELDS}

  query getTransactions(
    $fungibleName: String
    $accountName: String
    $chainId: String
    $blockHash: String
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    transactions(
      fungibleName: $fungibleName
      accountName: $accountName
      chainId: $chainId
      blockHash: $blockHash
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          ...CoreTransactionFields
          block {
            hash
          }
          cmd {
            signers {
              publicKey
              signature
            }
          }
        }
      }
    }
  }
`;

export const getTransfers: DocumentNode = gql`
  ${CORE_TRANSFER_FIELDS}

  query getTransfers(
    $fungibleName: String!
    $accountName: String!
    $chainId: String
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    transfers(
      fungibleName: $fungibleName
      accountName: $accountName
      chainId: $chainId
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          ...CoreTransferFields
          creationTime
          crossChainTransfer {
            ...CoreTransferFields
          }
          transaction {
            cmd {
              payload {
                ... on ContPayload {
                  pactId
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getEvents: DocumentNode = gql`
  ${ALL_EVENT_FIELDS}

  query getEvents(
    $qualifiedEventName: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    events(
      qualifiedEventName: $qualifiedEventName
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          ...AllEventFields
        }
      }
    }
  }
`;

export const estimateGasLimit: DocumentNode = gql`
  query estimateGasLimit($input: String!) {
    gasLimitEstimate(input: $input) {
      amount
      inputType
      usedPreflight
      usedSignatureVerification
      transaction
    }
  }
`;

export const getNonFungibleAccount: DocumentNode = gql`
  ${ALL_NON_FUNGIBLE_ACCOUNT_FIELDS}
  ${CORE_NON_FUNGIBLE_CHAIN_ACCOUNT_FIELDS}
  ${CORE_TRANSACTION_FIELDS}

  query getNonFungibleAccount($accountName: String!) {
    nonFungibleAccount(accountName: $accountName) {
      ...AllNonFungibleAccountFields
      chainAccounts {
        ...CoreNonFungibleChainAccountFields
      }
      nonFungibles {
        balance
        id
        chainId
      }
      transactions {
        edges {
          node {
            ...CoreTransactionFields
          }
        }
      }
    }
  }
`;

export const getNonFungibleChainAccount: DocumentNode = gql`
  ${CORE_NON_FUNGIBLE_CHAIN_ACCOUNT_FIELDS}
  ${CORE_TRANSACTION_FIELDS}

  query getNonFungibleChainAccount($accountName: String!, $chainId: String!) {
    nonFungibleChainAccount(accountName: $accountName, chainId: $chainId) {
      ...CoreNonFungibleChainAccountFields
      nonFungibles {
        balance
        id
        chainId
      }
      transactions {
        edges {
          node {
            ...CoreTransactionFields
          }
        }
      }
    }
  }
`;
