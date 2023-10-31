import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { devnetConfig } from '../../scripts/devnet/config';
import { dirtyRead } from '../../scripts/devnet/helper';
import { builder } from '../builder';

const PactData = builder.inputType('PactData', {
  fields: (t) => ({
    key: t.field({ type: 'String', required: true }),
    value: t.field({ type: 'String', required: true }),
  }),
});

const PactQuery = builder.inputType('PactQuery', {
  fields: (t) => ({
    code: t.field({ type: 'String', required: true }),
    chainId: t.field({ type: 'String', required: true }),
    data: t.field({ type: PactData }),
  }),
});

builder.queryField('pactQueries', (t) => {
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
          .setNetworkId(devnetConfig.NETWORK_ID);

        if (query.data) {
          transaction.addData(query.data.key, query.data.value);
        }

        const response = await dirtyRead(transaction.createTransaction());

        if (response.result.status === 'failure') {
          return String(response.result.status);
        }

        return JSON.stringify(response.result.data);
      });

      return result;
    },
  });
});

builder.queryField('pactQuery', (t) => {
  return t.field({
    type: 'String',
    args: {
      pactQuery: t.arg({ type: PactQuery, required: true }),
    },
    resolve: async (parent, args, context, info) => {
      const transaction = Pact.builder
        .execution(args.pactQuery.code)
        .setMeta({
          chainId: args.pactQuery.chainId as ChainId,
        })
        .setNetworkId(devnetConfig.NETWORK_ID)
        .createTransaction();

      const response = await dirtyRead(transaction);

      if (response.result.status === 'failure') {
        return String(response.result.status);
      }

      return JSON.stringify(response.result.data);
    },
  });
});
