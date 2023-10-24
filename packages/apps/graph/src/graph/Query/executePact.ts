import { Pact } from '@kadena/client';
import { devnetConfig } from '../../scripts/devnet/config';
import { dirtyRead } from '../../scripts/devnet/helper';
import { builder } from '../builder';

builder.queryField('executePact', (t) => {
  return t.field({
    type: ['String'],
    args: {
      pactQuery: t.arg.stringList({ required: true }),
      chainId: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, context, info) => {
      return args.pactQuery.map(async (query) => {
        const transaction = Pact.builder
          .execution(query)
          .setMeta({
            chainId: devnetConfig.CHAIN_ID,
          })
          .setNetworkId(devnetConfig.NETWORK_ID)
          .createTransaction();

        const response = await dirtyRead(transaction);

        if (response.result.status === 'failure') {
          return String(response.result.status);
        }

        return response.result.data.toString();
      });
    },
  });
});
