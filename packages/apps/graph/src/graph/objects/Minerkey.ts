import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Minerkey', {
  id: { field: 'blockHash_key' },
  name: 'Minerkey',
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
