import { DocumentNode, gql } from '@apollo/client';

export const getLastBlock: DocumentNode = gql`
  query getLastBlock {
    lastBlockHeight
  }
`;

export const getBlocksSubscription: DocumentNode = gql`
  subscription getBlocks {
    newBlocks {
      chainid
      creationtime
      epoch
      # flags
      hash
      height
      # miner
      nonce
      # parent
      payload
      powhash
      # predicate
      target
      weight
    }
  }
`;
