import { ALL_ACCOUNT_FIELDS } from './fields/account.graph';
import { ALL_BLOCK_FIELDS } from './fields/block.graph';
import {
  ALL_CHAIN_ACCOUNT_FIELDS,
  CORE_CHAIN_ACCOUNT_FIELDS,
} from './fields/chain-account.graph';
import { CORE_MINER_KEY_FIELDS } from './fields/miner-key.graph';
import { CORE_TRANSACTION_FIELDS } from './fields/transaction.graph';
import { CORE_TRANSFER_FIELDS } from './fields/transfer.graph';

import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

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
      minerKeys {
        ...CoreMinerKeyFields
      }
    }
  }
`;

export const getLastBlock: DocumentNode = gql`
  query getLastBlock {
    lastBlockHeight
  }
`;

export const getMaximumCalculatedConfirmationDepth: DocumentNode = gql`
  query getMaximumConfirmationDepth {
    maximumConfirmationDepth
  }
`;

export const getRecentHeights: DocumentNode = gql`
  query getRecentHeights($completedOnly: Boolean = true, $count: Int!) {
    completedBlockHeights(
      completedHeights: $completedOnly
      heightCount: $count
    ) {
      ...AllBlockFields
      confirmationDepth
      transactions {
        totalCount
      }
    }
  }
`;

export const getAccount: DocumentNode = gql`
  ${ALL_ACCOUNT_FIELDS}
  ${CORE_CHAIN_ACCOUNT_FIELDS}
  ${CORE_TRANSACTION_FIELDS}
  ${CORE_TRANSFER_FIELDS}

  query getAccount($moduleName: String!, $accountName: String!) {
    account(moduleName: $moduleName, accountName: $accountName) {
      ...AllAccountFields
      chainAccounts {
        ...CoreChainAccountFields
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
          }
        }
      }
    }
  }
`;

export const getChainAccount: DocumentNode = gql`
  ${CORE_TRANSACTION_FIELDS}
  ${CORE_TRANSFER_FIELDS}
  ${ALL_CHAIN_ACCOUNT_FIELDS}

  query getChainAccount(
    $moduleName: String!
    $accountName: String!
    $chainId: String!
  ) {
    chainAccount(
      moduleName: $moduleName
      accountName: $accountName
      chainId: $chainId
    ) {
      ...AllChainAccountFields
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
          }
        }
      }
    }
  }
`;

export const getTransactions: DocumentNode = gql`
  ${CORE_TRANSACTION_FIELDS}

  query getTransactions(
    $moduleName: String
    $accountName: String
    $chainId: String
    $blockHash: String
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    transactions(
      moduleName: $moduleName
      accountName: $accountName
      chainId: $chainId
      blockHash: $blockHash
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
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
        }
      }
    }
  }
`;

export const getTransfers: DocumentNode = gql`
  ${CORE_TRANSFER_FIELDS}

  query getTransfers(
    $moduleName: String!
    $accountName: String!
    $chainId: String
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    transfers(
      moduleName: $moduleName
      accountName: $accountName
      chainId: $chainId
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
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
        }
      }
    }
  }
`;
