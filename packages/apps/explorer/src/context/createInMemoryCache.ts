import { InMemoryCache } from '@apollo/client';

export const createInMemoryCache = () => {
  return new InMemoryCache({
    typePolicies: {
      Block: {
        keyFields: ['hash'],
      },
      Transaction: {
        keyFields: ['hash'],
      },
    },
  });
};
