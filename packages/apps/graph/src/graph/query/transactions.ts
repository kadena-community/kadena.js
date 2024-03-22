import type { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import TransactionConnection from '../objects/transaction-connection';
import { resolveTransactionConnection } from '../resolvers/transaction-connection';

const generateTransactionFilter = (args: {
  accountName?: string | null | undefined;
  fungibleName?: string | null | undefined;
  chainId?: string | null | undefined;
  blockHash?: string | null | undefined;
  requestKey?: string | null | undefined;
}): Prisma.TransactionWhereInput => ({
  ...(args.accountName && { senderAccount: args.accountName }),
  ...(args.fungibleName && {
    events: {
      some: {
        moduleName: args.fungibleName,
      },
    },
  }),
  ...(args.chainId && { chainId: parseInt(args.chainId) }),
  ...(args.blockHash && { blockHash: args.blockHash }),
  ...(args.requestKey && { requestKey: args.requestKey }),
});

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
        return await resolveTransactionConnection(
          args,
          context,
          generateTransactionFilter(args),
        );
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
