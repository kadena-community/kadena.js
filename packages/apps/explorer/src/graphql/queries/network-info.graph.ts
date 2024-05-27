import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const networkInfo: DocumentNode = gql`
  query networkInfo {
    networkInfo {
      apiVersion
      networkHost
      networkId
      transactionCount
      coinsInCirculation
      networkHashRate
      totalDifficulty
    }
  }
`;
