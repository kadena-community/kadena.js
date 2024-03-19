import { builder } from '../builder';
import TransactionCommand from './transaction-command';
import TransactionResult from './transaction-result';

export default builder.node('Transaction', {
  description: 'A transaction.',
  id: {
    resolve: (parent) => {
      if ('blockHash' in parent.result) {
        return JSON.stringify([parent.hash, parent.result.blockHash]);
      } else {
        return JSON.stringify([parent.hash, parent.result]);
      }
    },
  },

  fields: (t) => ({
    hash: t.exposeString('hash'),
    cmd: t.field({
      type: TransactionCommand,
      resolve: (parent) => parent.cmd,
    }),
    result: t.field({
      type: TransactionResult,
      resolve: (parent) => parent.result,
    }),
  }),
});
