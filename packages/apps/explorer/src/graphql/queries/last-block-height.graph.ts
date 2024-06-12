import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const lastBlockHeight: DocumentNode = gql`
  query lastBlockHeight {
    lastBlockHeight
  }
`;
