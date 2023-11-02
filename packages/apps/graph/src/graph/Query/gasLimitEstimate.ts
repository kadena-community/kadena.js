import { localReadForGasEstimation } from '../../devnet/helper';
import { builder } from '../builder';

const Transaction = builder.inputType('Transaction', {
  fields: (t) => ({
    code: t.field({ type: 'String', required: true }),
    hash: t.field({ type: 'String' }),
    sigs: t.field({ type: 'String' }),
  }),
});

builder.queryField('gasLimitEstimate', (t) => {
  return t.field({
    type: 'String',
    args: {
      transaction: t.arg({ type: Transaction, required: true }),
    },
    resolve: async (parent, args, context, info) => {
      const transaction = Pact.builder
        .execution(args.transaction.code)
        .setMeta({
          chainId: '0',
        })
        .setNetworkId('fast-development');

      const response = await localReadForGasEstimation(
        transaction.createTransaction(),
      );

      if (response.result.status === 'failure') {
        return String(response.result.status);
      }

      return JSON.stringify(response.result.data);
    },
  });
});
