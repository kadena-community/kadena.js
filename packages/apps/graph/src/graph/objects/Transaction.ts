import { prismaClient } from '../../utils/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Transaction', {
  id: { field: 'block_requestkey' },
  fields: (t) => ({
    // database fields
    reqKey: t.exposeString('requestkey'),

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
