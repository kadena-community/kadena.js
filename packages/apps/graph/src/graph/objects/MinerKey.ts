import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('MinerKey', {
  id: { field: 'blockHash_key' },
  fields: (t) => ({
    // database fields
    blockHash: t.exposeString('blockHash'),
    key: t.exposeString('key'),

    //relations
    block: t.prismaField({
      type: 'Block',
      nullable: false,
      // eslint-disable-next-line @typescript-eslint/typedef
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findUniqueOrThrow({
          where: {
            hash: parent.blockHash,
          },
        });
      },
    }),
  }),
});
