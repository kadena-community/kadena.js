import { prismaClient } from '@db/prisma-client';
import type { Block, Transfer } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { prismaTransactionMapper } from '../mappers/transaction-mapper';
import Transaction from './transaction';

export default builder.prismaNode(Prisma.ModelName.Transfer, {
  description: 'A transfer of funds from a fungible between two accounts.',
  id: { field: 'blockHash_chainId_orderIndex_moduleHash_requestKey' },
  select: {},
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
        'The order of the transfer when it is a `defpact` (multi-step transaction) execution.',
    }),
    moduleHash: t.exposeString('moduleHash'),
    moduleName: t.exposeString('moduleName'),
    requestKey: t.exposeString('requestKey'),
    receiverAccount: t.exposeString('receiverAccount'),

    // computed fields
    creationTime: t.field({
      type: 'DateTime',
      select: {
        blockHash: true,
      },
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      async resolve({ blockHash }) {
        try {
          return (
            (await prismaClient.block.findUnique({
              where: {
                hash: blockHash,
              },
              select: {
                creationTime: true,
              },
            })) as Block
          ).creationTime;
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
    crossChainTransfer: t.prismaField({
      description:
        'The counterpart of the crosschain-transfer. `null` when it is not a cross-chain-transfer.',
      type: Prisma.ModelName.Transfer,
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * 2, // In the worst case resolve scenario, it executes 2 queries.
      select: {
        amount: true,
        blockHash: true,
        requestKey: true,
      },
      async resolve(__query, parent) {
        try {
          // Find all transactions that match either of the two conditions
          const transactions = await prismaClient.transaction.findMany({
            where: {
              OR: [
                { pactId: parent.requestKey },
                { blockHash: parent.blockHash, requestKey: parent.requestKey },
              ],
            },
            include: { transfers: true },
          });

          // Filter the transactions to find the counterTransaction
          let counterTransaction = transactions.find(
            (transaction) =>
              transaction.pactId === parent.requestKey ||
              (transaction.blockHash === parent.blockHash &&
                transaction.requestKey === parent.requestKey &&
                transaction.pactId !== null &&
                transaction.pactId !== undefined),
          );

          if (!counterTransaction) {
            return null;
          }

          // If the counterTransaction was found using the second condition, find the initiating transaction
          if (
            counterTransaction.blockHash === parent.blockHash &&
            counterTransaction.requestKey === parent.requestKey &&
            counterTransaction.pactId
          ) {
            const initiatingTransaction =
              await prismaClient.transaction.findFirstOrThrow({
                where: {
                  requestKey: counterTransaction.pactId,
                  pactId: undefined,
                },
                include: { transfers: true },
              });

            counterTransaction = initiatingTransaction;
          }

          return counterTransaction.transfers
            ? (counterTransaction.transfers.find((transfer) =>
                transfer.amount.equals(new Decimal(parent.amount)),
              ) as Transfer)
            : null;
        } catch (error) {
          throw normalizeError(error);
        }

        /* Note: Multiple options were tested to find the cross chain counterpart, including using a single raw query.
        Although it would reduce the complexity, the time it takes is greater than the current method. This is due
        to raw queries resulting in unmapped responses and the additional processing this requires.
        In any case, here is the single raw query

          SELECT tr.*
          FROM transactions AS t1
          INNER JOIN transactions AS t2
            ON (t1.pactId = t2.requestKey AND t1.requestKey = ${requestKey})
            OR (t1.requestKey = t2.pactId AND t1.requestKey = ${requestKey} AND t1.block = ${blockHash})
          INNER JOIN transfers AS tr ON tr.requestKey = t2.requestKey AND tr.amount = ${amount}
          LIMIT 1
        `;
        */
      },
    }),

    // relations
    block: t.prismaField({
      type: Prisma.ModelName.Block,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        block: true,
      },
      async resolve(__query, parent) {
        try {
          return parent.block;
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    transaction: t.field({
      type: Transaction,
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        transaction: true,
      },

      async resolve(parent, __args, context) {
        try {
          return prismaTransactionMapper(parent.transaction, context);
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
