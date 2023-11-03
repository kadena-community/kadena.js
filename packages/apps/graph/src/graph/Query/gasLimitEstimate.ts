import { localReadTransfer } from '../../devnet/transfer';
import { builder } from '../builder';

const PactTransaction = builder.inputType('PactTransaction', {
  fields: (t) => ({
    cmd: t.field({ type: 'String', required: true }),
    hash: t.field({ type: 'String' }),
    sigs: t.field({ type: ['String'] }),
  }),
});

builder.queryField('gasLimitEstimate', (t) => {
  return t.field({
    type: 'Int',
    args: {
      transaction: t.arg({ type: PactTransaction, required: true }),
    },
    resolve: async (parent, args, context, info) => {
      if (args.transaction.cmd.includes(`\\`)) {
        args.transaction.cmd = args.transaction.cmd.replace(/\\\\/g, '\\');
      }
      const result = await localReadTransfer({
        cmd: args.transaction.cmd,
      });
      return result.gas;
    },
  });
});

builder.queryField('gasLimitEstimates', (t) => {
  return t.field({
    type: ['Int'],
    args: {
      transactions: t.arg({ type: [PactTransaction], required: true }),
    },
    resolve: async (parent, args, context, info) => {
      return args.transactions.map(async (transaction) => {
        if (transaction.cmd.includes('//')) {
          transaction.cmd = transaction.cmd.replace(/\/\//g, '/');
        }
        const result = await localReadTransfer({
          cmd: transaction.cmd,
        });
        return result.gas;
      });
    },
  });
});
