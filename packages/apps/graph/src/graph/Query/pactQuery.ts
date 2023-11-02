import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { devnetConfig } from '../../devnet/config';
import { dirtyRead } from '../../devnet/helper';
import { builder } from '../builder';

const PactData = builder.inputType('PactQueryData', {
  fields: (t) => ({
    key: t.field({ type: 'String', required: true }),
    value: t.field({ type: 'String', required: true }),
  }),
});

const PactQuery = builder.inputType('PactQuery', {
  fields: (t) => ({
    code: t.field({ type: 'String', required: true }),
    chainId: t.field({ type: 'String', required: true }),
    data: t.field({ type: [PactData] }),
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

        query.data?.forEach((data) => {
          transaction.addData(data.key, data.value);
        });

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
        .setNetworkId(devnetConfig.NETWORK_ID);

      args.pactQuery.data?.forEach((data) => {
        transaction.addData(data.key, data.value);
      });

      const response = await dirtyRead(transaction.createTransaction());

      if (response.result.status === 'failure') {
        return String(response.result.status);
      }

      return JSON.stringify(response.result.data);
    },
  });
});
