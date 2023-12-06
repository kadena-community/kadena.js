import { prismaClient } from '@db/prismaClient';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { PRISMA, builder } from '../builder';

export default builder.prismaNode('Transfer', {
  description: 'A transfer of funds from a fungible between two accounts.',
  id: { field: 'blockHash_chainId_orderIndex_moduleHash_requestKey' },
  fields: (t) => ({
    // database fields
    amount: t.expose('amount' as never, { type: 'Decimal' }),
    blockHash: t.exposeString('blockHash'),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    senderAccount: t.exposeString('senderAccount'),
    height: t.expose('height', { type: 'BigInt' }),
    orderIndex: t.expose('orderIndex', {
      type: 'BigInt',
      description:
        'The order of the transfer in the case that there are chained Transfers.',
    }),
    moduleHash: t.exposeString('moduleHash'),
    moduleName: t.exposeString('moduleName'),
    requestKey: t.exposeString('requestKey'),
    receiverAccount: t.exposeString('receiverAccount'),

    // computed fields
    crossChainTransfer: t.prismaField({
      description: 'The transfer that is the counterparty of this transfer.',
      type: 'Transfer',
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * 4, // In the worst case resolve scenario, it executes 4 queries.
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
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      async resolve(query, parent) {
        try {
          return await prismaClient.block.findMany({
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

    transaction: t.prismaField({
      description: 'The transaction that initiated this transfer.',
      type: 'Transaction',
      nullable: true,
      complexity:
        COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * PRISMA.DEFAULT_SIZE,
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
  }),
});
