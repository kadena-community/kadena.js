import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Event', {
  id: { field: 'blockHash_orderIndex_requestKey' },
  fields: (t) => ({
    // database fields
    chainId: t.expose('chainId', { type: 'BigInt' }),
    height: t.expose('height', { type: 'BigInt' }),
    orderIndex: t.expose('orderIndex', { type: 'BigInt' }),
    moduleName: t.exposeString('moduleName'),
    name: t.exposeString('name'),
    parameterText: t.exposeString('parameterText'),
    qualifiedName: t.exposeString('qualifiedName'),
    requestKey: t.exposeString('requestKey'),

    //relations
    transaction: t.prismaField({
      type: 'Transaction',
      nullable: true,
      resolve(query, parent, args, context, info) {
        return prismaClient.transaction.findUnique({
          where: {
            blockHash_requestKey: {
              blockHash: parent.blockHash,
              requestKey: parent.requestKey,
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
            hash: parent.blockHash,
          },
        });
      },
    }),
  }),
});
