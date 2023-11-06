import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
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
      async resolve(__query, parent) {
        try {
          return await prismaClient.block.findUniqueOrThrow({
            where: {
              hash: parent.blockHash,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
