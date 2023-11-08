import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
import { nullishOrEmpty } from '@utils/nullishOrEmpty';
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

    // computed fields
    crossChainTransfer: t.prismaField({
      type: 'Transfer',
      nullable: true,
      async resolve(__query, parent) {
        try {
          let counterTransaction;

          // Try to find finisher transfer
          const finisherTransfer = await prismaClient.transaction.findFirst({
            where: {
              pactId: parent.requestKey,
            },
          });

          if (finisherTransfer) {
            counterTransaction = finisherTransfer;
          } else {
            // If not found, try to find the initiating transfer
            // First find the corresponding transaction
            const finisherTransaction =
              await prismaClient.transaction.findFirst({
                where: {
                  blockHash: parent.blockHash,
                  requestKey: parent.requestKey,
                },
              });

            if (
              !finisherTransaction ||
              finisherTransaction.pactId === undefined ||
              finisherTransaction.pactId === null
            ) {
              return null;
            }

            // Then find the initiating transaction with the pactId
            const initiatingTransaction =
              await prismaClient.transaction.findFirstOrThrow({
                where: {
                  requestKey: finisherTransaction.pactId,
                  pactId: undefined,
                },
              });

            counterTransaction = initiatingTransaction;
          }

          return await prismaClient.transfer.findFirst({
            where: {
              blockHash: counterTransaction.blockHash,
              requestKey: counterTransaction.requestKey,
              OR: [{ senderAccount: '' }, { receiverAccount: '' }],
              amount: parent.amount,
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

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
