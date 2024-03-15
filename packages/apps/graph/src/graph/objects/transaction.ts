import { builder } from '../builder';
import TransactionCommand from './transaction-command';
import TransactionResult from './transaction-result';

export default builder.node('Transaction', {
  description: 'A transaction.',
  id: {
    resolve: (parent) =>
      JSON.stringify([parent.hash, parent.cmd.meta.creationTime]),
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
