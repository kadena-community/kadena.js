import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

export default builder.prismaNode('Event', {
  description: 'A record of an execution of a function on a smart contract.',
  id: { field: 'blockHash_orderIndex_requestKey' },
  fields: (t) => ({
    // database fields
    chainId: t.expose('chainId', { type: 'BigInt' }),
    height: t.expose('height', {
      type: 'BigInt',
      description: 'The block height of this event.',
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
      description: 'The module name and the event name combined.',
    }),
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
