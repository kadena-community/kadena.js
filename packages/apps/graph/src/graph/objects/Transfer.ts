import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Transfer', {
  id: { field: 'block_chainid_idx_modulehash_requestkey' },
  fields: (t) => ({
    // database fields
    amount: t.expose('amount', { type: 'Decimal' }),
    blockHash: t.exposeString('block'),
    chainId: t.expose('chainid', { type: 'BigInt' }),
    fromAccount: t.exposeString('from_acct'),
    height: t.expose('height', { type: 'BigInt' }),
    idx: t.expose('idx', { type: 'BigInt' }),
    moduleHash: t.exposeString('modulehash'),
    moduleName: t.exposeString('modulename'),
    requestKey: t.exposeString('requestkey'),
    toAccount: t.exposeString('to_acct'),

    // relations
    blocks: t.prismaField({
      type: ['Block'],
      // eslint-disable-next-line @typescript-eslint/typedef
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findMany({
          where: {
            hash: parent.block,
          },
        });
      },
    }),
  }),
});
