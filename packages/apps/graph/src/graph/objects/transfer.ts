import { prismaClient } from '@db/prisma-client';
import type { Block, Transfer } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

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
      complexity: COMPLEXITY.FIELD.PRISMA_WITH_RELATIONS * 2, // In the worst case resolve scenario, it executes 2 queries.
      select: {
        amount: true,
        blockHash: true,
        requestKey: true,
        senderAccount: true,
        receiverAccount: true,
        transaction: {
          select: {
            pactId: true,
          },
        },
      },
      async resolve(__query, parent) {
        try {
          // Only transactions that have an empty sender or receiver are crosschain transfers
          if (parent.senderAccount !== '' && parent.receiverAccount !== '') {
            return null;
          }
          // If it doesn't have a related transaction or pactid, it's not a crosschain transfer
          // This usually doesn't happen, but TypeScript requires it as the db-schema doesn't define it
          if (
            parent.transaction?.pactId === null ||
            parent.transaction?.pactId === undefined
          ) {
            return null;
          }

          let where: Prisma.TransactionWhereInput = {};

          if (parent.receiverAccount === '') {
            // this is the sending side of the crosschain transfer
            // we're looking for a transaction that has the same pactId as the requestKey
            where = {
              pactId: parent.requestKey,
            };
          }

          if (parent.senderAccount === '') {
            // this is the receiving side of the crosschain transfer
            // we're looking for a transaction that has the same requestKey as the pactId
            where = {
              requestKey: parent.transaction.pactId,
            };
          }

          let counterpartTx = await prismaClient.transaction.findFirstOrThrow({
            where,
            include: {
              transfers: {
                where: {
                  amount: parent.amount,
                },
                take: 1,
              },
            },
          });

          if (!!counterpartTx) {
            return counterpartTx.transfers[0];
          }
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
        blockHash: true,
      },
      async resolve(query, parent) {
        try {
          return (
            parent.block ||
            (await prismaClient.block.findUnique({
              ...query,
              where: {
                hash: parent.blockHash,
              },
            }))
          );
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),

    transaction: t.prismaField({
      description: 'The transaction that initiated this transfer.',
      type: Prisma.ModelName.Transaction,
      nullable: true,
      complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
      select: {
        transaction: true,
        blockHash: true,
        requestKey: true,
      },
      async resolve(query, parent) {
        try {
          return (
            parent.transaction ||
            (await prismaClient.transaction.findUnique({
              ...query,
              where: {
                blockHash_requestKey: {
                  blockHash: parent.blockHash,
                  requestKey: parent.requestKey,
                },
              },
            }))
          );
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
