import { prismaClient } from '@db/prisma-client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

export default builder.prismaNode('Event', {
  description:
    'An event emitted by the execution of a smart-contract function.',
  id: { field: 'blockHash_orderIndex_requestKey' },
  fields: (t) => ({
    // database fields
    incrementedId: t.exposeInt('id'),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    height: t.expose('height', {
      type: 'BigInt',
      description: 'The height of the block where the event was emitted.',
    }),
    orderIndex: t.expose('orderIndex', {
      type: 'BigInt',
      description:
        'The order index of this event, in the case that there are multiple events.',
    }),
    moduleName: t.exposeString('moduleName'),
    name: t.exposeString('name'),
    parameterText: t.exposeString('parameterText'),
    qualifiedName: t.exposeString('qualifiedName', {
      description:
        'The full eventname, containing module and eventname, e.g. coin.TRANSFER',
    }),
    requestKey: t.exposeString('requestKey'),

    //relations
    transaction: t.prismaField({
      type: 'Transaction',
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      async resolve(query, parent) {
        try {
          return await prismaClient.transaction.findUnique({
            ...query,
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
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      async resolve(query, parent) {
        try {
          return await prismaClient.block.findUniqueOrThrow({
            ...query,
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
