import { ChainId, Pact } from '@kadena/client';
import { devnetConfig } from '../../scripts/devnet/config';
import { dirtyRead } from '../../scripts/devnet/helper';
import { builder } from '../builder';

const PactQuery = builder.inputType('PactQuery', {
  fields: (t) => ({
    code: t.field({ type: 'String', required: true }),
    chainId: t.field({ type: 'String', required: true }),
  }),
});

builder.queryField('executePact', (t) => {
  return t.field({
    type: ['String'],
    args: {
      pactQuery: t.arg({ type: [PactQuery], required: true }),
    },
    resolve: async (parent, args, context, info) => {
      const result = args.pactQuery.map(async (query) => {
        const transaction = Pact.builder
          .execution(query.code)
          .setMeta({
            chainId: query.chainId as ChainId,
          })
          .setNetworkId(devnetConfig.NETWORK_ID)
          .createTransaction();

        const response = await dirtyRead(transaction);

        if (response.result.status === 'failure') {
          return String(response.result.status);
        }

        console.log(response);
        return JSON.stringify(response.result.data);
      });

      return result;
    },
  });
});
