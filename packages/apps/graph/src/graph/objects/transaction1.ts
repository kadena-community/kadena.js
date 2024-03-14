import { builder } from '../builder';
import TransactionCommand1 from './transaction-command1';
import TransactionResult from './transaction-result1';

export default builder.node('Transaction1', {
  description: 'A transaction.',
  id: {
    resolve: (parent) =>
      JSON.stringify([parent.hash, parent.cmd.meta.creationTime]),
  },

  fields: (t) => ({
    hash: t.exposeString('hash'),
    cmd: t.field({
      type: TransactionCommand1,
      resolve: (parent) => parent.cmd,
    }),
    result: t.field({
      type: TransactionResult,
      resolve: (parent) => parent.result,
    }),
  }),
});
