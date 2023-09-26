import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Event', {
  id: { field: 'blockhash_idx_requestkey' },
  fields: (t) => ({
    // database fields
    chainId: t.expose('chainid', { type: 'BigInt' }),
    height: t.expose('height', { type: 'BigInt' }),
    index: t.expose('idx', { type: 'BigInt' }),
    module: t.exposeString('module'),
    name: t.exposeString('name'),
    qualName: t.exposeString('qualname'),
    requestKey: t.exposeString('requestkey'),

    // computed fields
    eventParameters: t.field({
      type: ['String'],
      resolve(parent) {
        return JSON.parse(parent.paramtext);
      },
    }),

    //relations
    transaction: t.prismaField({
      type: 'Transaction',
      nullable: true,
      resolve(query, parent, args, context, info) {
        return prismaClient.transaction.findUnique({
          where: {
            blockhash_requestkey: {
              blockhash: parent.blockhash,
              requestkey: parent.requestkey,
            },
          },
        });
      },
    }),

    block: t.prismaField({
      type: 'Block',
      nullable: false,
      // eslint-disable-next-line @typescript-eslint/typedef
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findUniqueOrThrow({
          where: {
            hash: parent.blockhash,
          },
        });
      },
    }),
  }),
});
