import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Transaction', {
  id: { field: 'block_requestkey' },
  fields: (t) => ({
    // database fields
    reqKey: t.exposeString('requestkey', {
      deprecationReason: 'Use requestkey instead',
    }),
    nonce: t.exposeString('nonce'),
    code: t.exposeString('code', { nullable: true }),
    data: t.field({
      type: 'String',
      nullable: true,
      resolve(parent) {
        return JSON.stringify(parent.data);
      },
    }),

    // computed fields
    gas: t.expose('gas', { type: 'BigInt' }),

    // relations
    block: t.prismaField({
      type: 'Block',
      nullable: true,
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findUnique({
          where: {
            hash: parent.block,
          },
        });
      },
    }),
  }),
});
