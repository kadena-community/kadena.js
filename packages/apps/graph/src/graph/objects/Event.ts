import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Event', {
  id: { field: 'block_idx_requestkey' },
  fields: (t) => ({
    // database fields
    chainId: t.expose('chainid', { type: 'BigInt' }),
    height: t.expose('height', { type: 'BigInt' }),
    index: t.expose('idx', { type: 'BigInt' }),
    module: t.exposeString('module'),
    name: t.exposeString('name'),
    qualName: t.exposeString('qualname'),
    paramText: t.exposeString('paramtext'),
    requestKey: t.exposeString('requestkey'),
    parameters: t.field({
      type: 'String',
      resolve(parent) {
        return JSON.stringify(parent.params);
      },
    }),

    //relations
    block: t.prismaField({
      type: 'Block',
      nullable: true,
      // eslint-disable-next-line @typescript-eslint/typedef
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
