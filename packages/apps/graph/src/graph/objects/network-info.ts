import { builder } from '../builder';

export default builder.objectType('NetworkInfo', {
  description: 'Information about the network.',
  fields: (t) => ({
    networkHost: t.exposeString('networkHost', {
      description: 'The host of the network.',
    }),
    networkId: t.exposeString('networkId', {
      description: 'The ID of the network.',
    }),
    apiVersion: t.exposeString('apiVersion', {
      description: 'The version of the API.',
    }),
    circulatingCoins: t.exposeFloat('circulatingCoins', {
      description: 'The number of circulating coins.',
    }),
    totalTransactions: t.exposeInt('totalTransactions', {
      description: 'The total number of transactions.',
    }),
  }),
});
