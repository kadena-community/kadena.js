import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.prismaNode('Transfer', {
  id: { field: 'block_chainId_orderIndex_moduleHash_requestKey' },
  fields: (t) => ({
    // database fields
    amount: t.expose('amount' as never, { type: 'Decimal' }),
    blockHash: t.exposeString('block'),
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
      // eslint-disable-next-line @typescript-eslint/typedef
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findMany({
          where: {
            hash: parent.block,
          },
        });
      },
    }),
  }),
});
