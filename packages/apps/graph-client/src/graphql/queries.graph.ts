import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_BLOCK_FIELDS: DocumentNode = gql`
  fragment CoreBlockFields on Block {
    id
    chainId
    creationTime
    epoch
    # flags
    hash
    height
    # miner
    # nonce
    # parent
    # payload
    powHash
    # predicate
    # target
    # weight
    # transactions {
    #   totalCount
    #   edges {
    #     node {
    #       id
    #       reqKey
    #     }
    #   }
    # }
    confirmationDepth
    parentHash
  }
`;

export const CORE_TRANSACTION_FIELDS: DocumentNode = gql`
  fragment CoreTransactionFields on Transaction {
    id
    # badResult
    # block
    chainId
    # code
    # continuation
    creationTime
    # data
    gas
    gasLimit
    gasPrice
    # goodResult
    height
    # logs
    # metadata
    # nonce
    # numEvents
    # pactId
    # proof
    requestKey
    # rollback
    # sender
    # step
    ttl
    # txId
  }
`;

export const CORE_EVENT_FIELDS: DocumentNode = gql`
  fragment CoreEventFields on Event {
    id
    #block{}
    requestKey
    chainId
    height
    #orderindex
    #module
    #name
    parameterText
    #parameters
    qualifiedName
  }
`;

export const getLastBlock: DocumentNode = gql`
  query getLastBlock {
    lastBlockHeight
  }
`;

export const getRecentHeights: DocumentNode = gql`
  ${CORE_BLOCK_FIELDS}

  query getRecentHeights($completedOnly: Boolean = true, $count: Int!) {
    completedBlockHeights(
      completedHeights: $completedOnly
      heightCount: $count
    ) {
      ...CoreBlockFields
    }
  }
`;

export const getAccount: DocumentNode = gql`
  query getAccount($moduleName: String!, $accountName: String!) {
    account(moduleName: $moduleName, accountName: $accountName) {
      # id
      accountName
      moduleName

      totalBalance

      chainAccounts {
        # accountName
        balance
        chainId
        # guard {
        #   keys
        #   predicate
        # }
        # moduleName
        # transactions
        # transfers
      }
      transactions {
        edges {
          node {
            # id
            # badResult
            chainId
            code
            # continuation
            creationTime
            # data
            # gas
            # gasLimit
            # gasPrice
            # goodResult
            height
            # logs
            # metadata
            # nonce
            # numEvents
            # pactId
            # proof
            requestKey
            # rollback
            # sender
            # step
            # ttl
            # txId
          }
        }
      }
      transfers {
        edges {
          node {
            amount
            # blockHash
            chainId
            fromAccount
            height
            # id
            # idx
            # moduleHash
            # moduleName
            requestKey
            toAccount
          }
        }
      }
    }
  }
`;

export const getChainAccount: DocumentNode = gql`
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
      accountName
      balance
      chainId
      guard {
        keys
        predicate
      }
      moduleName
      transactions {
        edges {
          node {
            # id
            # badResult
            chainId
            code
            # continuation
            creationTime
            # data
            # gas
            # gasLimit
            # gasPrice
            # goodResult
            height
            # logs
            # metadata
            # nonce
            # numEvents
            # pactId
            # proof
            requestKey
            # rollback
            # sender
            # step
            # ttl
            # txId
          }
        }
      }
      transfers {
        edges {
          node {
            amount
            # blockHash
            chainId
            fromAccount
            height
            # id
            # idx
            # moduleHash
            # moduleName
            requestKey
            toAccount
          }
        }
      }
    }
  }
`;

export const getTransactions: DocumentNode = gql`
  query getTransactions(
    $moduleName: String!
    $accountName: String!
    $chainId: String
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    transactions(
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
          # id
          # badResult
          chainId
          code
          # continuation
          creationTime
          # data
          # gas
          # gasLimit
          # gasPrice
          # goodResult
          height
          # logs
          # metadata
          # nonce
          # numEvents
          # pactId
          # proof
          requestKey
          # rollback
          # sender
          # step
          # ttl
          # txId
        }
      }
    }
  }
`;

export const getTransfers: DocumentNode = gql`
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
          amount
          # blockHash
          chainId
          fromAccount
          height
          # id
          # idx
          # moduleHash
          # moduleName
          # requestKey
          toAccount
        }
      }
    }
  }
`;

export const getBlocksSubscription: DocumentNode = gql`
  ${CORE_BLOCK_FIELDS}

  subscription getBlocks {
    newBlocks {
      ...CoreBlockFields
    }
  }
`;

export const getTransactionByRequestKey: DocumentNode = gql`
  subscription getTransactionByRequestKey($requestKey: String!) {
    transaction(requestKey: $requestKey) {
      id
      badResult
      block {
        id
      }
      events {
        qualifiedName
        parameterText
      }
      chainId
      code
      continuation
      creationTime
      data
      gas
      gasLimit
      gasPrice
      goodResult
      height
      logs
      metadata
      nonce
      eventCount
      pactId
      proof
      requestKey
      rollback
      sender
      step
      ttl
      transactionId
    }
  }
`;

export const getEventByName: DocumentNode = gql`
  subscription getEventByName($eventName: String!) {
    event(eventName: $eventName) {
      # id
      block {
        id
      }
      chainId
      height
      orderIndex
      # module
      # name
      parameterText
      qualifiedName
      transaction {
        requestKey
      }
    }
  }
`;
