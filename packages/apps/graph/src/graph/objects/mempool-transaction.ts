import { builder } from '../builder';
import GQLTransactionCommand from './transaction-command';

export const GQLMempoolTransaction = builder.objectType('MempoolTransaction', {
  description: 'A transaction in the mempool.',
  fields: (t) => ({
    hash: t.exposeString('hash', {
      description: 'The hash of the transaction.',
    }),
    cmd: t.field({
      description: 'The command of the transaction.',
      type: GQLTransactionCommand,
      resolve: (parent) => {
        return parent.cmd;
      },
    }),
  }),
});
