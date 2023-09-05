import { DocumentNode, gql } from '@apollo/client';

export const CORE_BLOCK_FIELDS: DocumentNode = gql`
  fragment CoreBlockFields on Block {
    id
    chainid
    creationtime
    epoch
    # flags
    hash
    height
    # miner
    # nonce
    # parent
    # payload
    powhash
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

export const getBlocksSubscription: DocumentNode = gql`
  ${CORE_BLOCK_FIELDS}

  subscription getBlocks {
    newBlocks {
      ...CoreBlockFields
    }
  }
`;
