import { Pact } from '@kadena/client';
import { resourceLimits } from 'worker_threads';
import { devnetConfig } from '../../scripts/devnet/config';
import { dirtyRead } from '../../scripts/devnet/helper';
import { builder } from '../builder';

builder.queryField('executePact', (t) => {
  return t.field({
    type: 'String',
    args: {
      query: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, context, info) => {
      const query = Pact.builder
        .execution(args.query)
        .setMeta({
          chainId: devnetConfig.CHAIN_ID,
        })
        .setNetworkId(devnetConfig.NETWORK_ID)
        .createTransaction();

      const response = await dirtyRead(query);
      console.log(response);

      if (response.result.status === 'failure') {
        console.log('entrei');
        return String(response.result.status);
      }

      return response.result.data.toString();
    },
  });
});
