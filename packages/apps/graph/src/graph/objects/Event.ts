import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
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
      async resolve(__query, parent) {
        try {
          return await prismaClient.transaction.findUnique({
            where: {
              blockHash_requestKey: {
                blockHash: parent.blockHash,
                requestKey: parent.requestKey,
              },
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

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
