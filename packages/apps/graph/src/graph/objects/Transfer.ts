import { prismaClient } from '@src/db/prismaClient';
import { normalizeError } from '@src/utils/errors';
import { builder } from '../builder';

export default builder.prismaNode('Transfer', {
  id: { field: 'blockHash_chainId_orderIndex_moduleHash_requestKey' },
  fields: (t) => ({
    // database fields
    amount: t.expose('amount' as never, { type: 'Decimal' }),
    blockHash: t.exposeString('blockHash'),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    senderAccount: t.exposeString('senderAccount'),
    height: t.expose('height', { type: 'BigInt' }),
    orderIndex: t.expose('orderIndex', { type: 'BigInt' }),
    moduleHash: t.exposeString('moduleHash'),
    moduleName: t.exposeString('moduleName'),
    requestKey: t.exposeString('requestKey'),
    receiverAccount: t.exposeString('receiverAccount'),

    // relations
    blocks: t.prismaField({
      type: ['Block'],
      async resolve(__query, parent) {
        try {
          return await prismaClient.block.findMany({
            where: {
              hash: parent.blockHash,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

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
  }),
});
