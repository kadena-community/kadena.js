import { prismaClient } from '@db/prisma-client';
import type { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { prismaTransactionMapper } from '../mappers/transaction-mapper';
import Transaction from '../objects/transaction';
import TransactionConnection from '../objects/transaction-connection';
import { resolveTransactionConnection } from '../resolvers/transaction-connection';

builder.queryField('transaction', (t) =>
  t.field({
    description: 'Retrieve a completed transaction by its unique key.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: true }),
      requestKey: t.arg.string({ required: true }),
    },
    type: Transaction,
    complexity: getDefaultConnectionComplexity(),
    async resolve(__parent, args, context) {
      try {
        const prismaTransactiom = await prismaClient.transaction.findUnique({
          where: {
            blockHash_requestKey: {
              blockHash: args.blockHash,
              requestKey: args.requestKey,
            },
          },
        });

        if (!prismaTransactiom) return null;

        return prismaTransactionMapper(prismaTransactiom, context);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

builder.queryField('transactions', (t) =>
  t.field({
    description: 'Retrieve transactions. Default page size is 20.',
    nullable: false,
    type: TransactionConnection,
    args: {
      accountName: t.arg.string({ required: false }),
      fungibleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
      blockHash: t.arg.string({ required: false }),
      requestKey: t.arg.string({ required: false }),
      first: t.arg.int({ required: false }),
      last: t.arg.int({ required: false }),
      before: t.arg.string({ required: false }),
      after: t.arg.string({ required: false }),
    },
    complexity: getDefaultConnectionComplexity(),
    async resolve(__parent, args, context) {
      try {
        const whereCondition = generateTransactionFilter(args);

        return await resolveTransactionConnection(
          args,
          context,
          whereCondition,
        );
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

function generateTransactionFilter(args: {
  accountName?: string | null | undefined;
  fungibleName?: string | null | undefined;
  chainId?: string | null | undefined;
  blockHash?: string | null | undefined;
  requestKey?: string | null | undefined;
}): Prisma.TransactionWhereInput {
  const whereFilter: Prisma.TransactionWhereInput = {};

  if (args.accountName) {
    whereFilter.senderAccount = args.accountName;
  }

  if (args.fungibleName) {
    if (whereFilter.events) {
      whereFilter.events.some = { moduleName: args.fungibleName };
    } else {
      whereFilter.events = { some: { moduleName: args.fungibleName } };
    }
  }

  if (args.chainId) {
    whereFilter.chainId = parseInt(args.chainId);
  }

  if (args.blockHash) {
    whereFilter.blockHash = args.blockHash;
  }

  if (args.requestKey) {
    whereFilter.requestKey = args.requestKey;
  }

  return whereFilter;
}
