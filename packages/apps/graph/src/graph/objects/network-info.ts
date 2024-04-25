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
    coinsInCirculation: t.exposeFloat('coinsInCirculation', {
      description: 'The number of circulating coins.',
    }),
    transactionCount: t.exposeInt('transactionCount', {
      description: 'The total number of transactions.',
    }),
    networkHashRate: t.exposeFloat('networkHashRate', {
      description: 'The network hash rate in PH/S.',
    }),
    totalDifficulty: t.exposeFloat('totalDifficulty', {
      description: 'The total difficulty in EH.',
    }),
  }),
});
