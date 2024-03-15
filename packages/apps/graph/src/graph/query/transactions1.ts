import { prismaClient } from '@db/prisma-client';
import {
  ResolveCursorConnectionArgs,
  resolveCursorConnection,
} from '@pothos/plugin-relay';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { PRISMA, builder } from '../builder';
import Transaction1 from '../objects/transaction1';
import { prismaTransactionMapper } from '../utils/transaction-mapper';

builder.queryField('transaction1', (t) =>
  t.field({
    description: 'Retrieve a completed transaction by its unique key.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: true }),
      requestKey: t.arg.string({ required: true }),
    },
    type: Transaction1,
    complexity: getDefaultConnectionComplexity(),
    async resolve(parent, args, context) {
      console.log(parent);
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

        const prismaSigners = await prismaClient.signer.findMany({
          where: { requestKey: prismaTransactiom.requestKey },
          take: PRISMA.DEFAULT_SIZE,
        });

        return prismaTransactionMapper(
          prismaTransactiom,
          prismaSigners,
          context,
        );
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

builder.queryField(
  'transactions1',
  (t) =>
    t.prismaConnection({
      description: 'Retrieve transactions.',
      edgesNullable: false,
      args: {
        accountName: t.arg.string({ required: false }),
        fungibleName: t.arg.string({ required: false }),
        chainId: t.arg.string({ required: false }),
        blockHash: t.arg.string({ required: false }),
        requestKey: t.arg.string({ required: false }),
      },
      type: Prisma.ModelName.Transaction,
      cursor: 'blockHash_requestKey',
      complexity: (args) => ({
        field: getDefaultConnectionComplexity({
          withRelations: !!args.fungibleName,
          first: args.first,
          last: args.last,
        }),
      }),
      async totalCount(__parent, args) {
        try {
          return await prismaClient.transaction.count({
            where: generateTransactionFilter(args),
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
      async resolve(query, __parent, args) {
        try {
          const whereFilter = generateTransactionFilter(args);

          return await prismaClient.transaction.findMany({
            ...query,
            where: {
              ...whereFilter,
            },
            orderBy: {
              height: 'desc',
            },
          });
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  // t.connection({
  //   description: 'Retrieve transactions.',
  //   edgesNullable: false,
  //   args: {
  //     accountName: t.arg.string({ required: false }),
  //     fungibleName: t.arg.string({ required: false }),
  //     chainId: t.arg.string({ required: false }),
  //     blockHash: t.arg.string({ required: false }),
  //     requestKey: t.arg.string({ required: false }),
  //   },
  //   type: Transaction1,

  //   async resolve(__parent, args, context) {
  //     try {
  //       const whereFilter = generateTransactionFilter(args);
  //       const totalCount = await prismaClient.transaction.count({
  //         where: whereFilter,
  //       });

  //       console.log(totalCount);

  //       const connection = await resolveCursorConnection(
  //         {
  //           args,
  //           toCursor: (transaction) =>
  //             Buffer.from(
  //               JSON.stringify([
  //                 transaction.hash,
  //                 transaction.cmd.meta.creationTime,
  //               ]),
  //             ).toString('base64'),
  //         },
  //         async ({
  //           before,
  //           after,
  //           limit,
  //           inverted,
  //         }: ResolveCursorConnectionArgs) => {
  //           const orderByDirection = inverted ? 'asc' : 'desc';

  //           console.log('after', after);
  //           if (before) before = Buffer.from(before, 'base64').toString();
  //           if (after) after = Buffer.from(after, 'base64').toString();

  //           console.log('after', after);

  //           const creationTime = after ? JSON.parse(after)[1] : undefined;

  //           console.log('creationTime', creationTime);

  //           const prismaTransactions = await prismaClient.transaction.findMany({
  //             take: limit,
  //             where: {
  //               ...whereFilter,
  //               AND: {
  //                 creationTime: {
  //                   [inverted ? 'gt' : 'lt']: after
  //                     ? JSON.parse(after)[1]
  //                     : undefined,
  //                   [inverted ? 'lt' : 'gt']: before
  //                     ? JSON.parse(before)[1]
  //                     : undefined,
  //                 },
  //               },
  //             },
  //             orderBy: [
  //               { height: orderByDirection },
  //               { creationTime: orderByDirection },
  //             ],
  //           });

  //           console.log(prismaTransactions);

  //           return prismaTransactions.map((prismaTransaction) =>
  //             prismaTransactionMapper(prismaTransaction, [], context),
  //           );
  //         },
  //       );

  //       return {
  //         totalCount,
  //         pageInfo: connection.pageInfo,
  //         edges: connection.edges,
  //       };
  //     } catch (error) {
  //       throw normalizeError(error);
  //     }
  //   },

  //   // try {
  //   //   const whereFilter = generateTransactionFilter(args);
  //   //   const first = args.first;
  //   //   const last = args.last;
  //   //   const after = args.after;
  //   //   const before = args.before;

  //   //   const orderByDirection = last ? 'asc' : 'desc';
  //   //   const take = last || first;
  //   //   const cursor = after || before;

  //   //   const totalCount = await prismaClient.transaction.count({
  //   //     where: whereFilter,
  //   //   });

  //   //   const prismaTransactions = await prismaClient.transaction.findMany({
  //   //     where: whereFilter,
  //   //     orderBy: { height: orderByDirection },
  //   //     take: take ? take + 1 : 21,
  //   //   });

  //   //   if (last) {
  //   //     prismaTransactions.reverse();
  //   //   }

  //   //   const pageLength = last ? last : first ? first : 20;

  //   //   const hasNextPage = prismaTransactions.length > pageLength;
  //   //   const hasPreviousPage = before ? true : false;

  //   //   if (hasPreviousPage) {
  //   //     const previousTransaction = await prismaClient.transaction.findFirst({
  //   //       where: {
  //   //         ...whereFilter,
  //   //         height: { lt: prismaTransactions[0].height },
  //   //       },
  //   //       orderBy: { height: 'desc' },
  //   //     });

  //   //     //implement cursor logic
  //   //     if (previousTransaction) {
  //   //     }
  //   //   }

  //   //   //remove the extra one
  //   //   prismaTransactions.pop();

  //   //   const edges = prismaTransactions.map((prismaTransaction) => ({
  //   //     cursor:
  //   //       prismaTransaction.blockHash + '_' + prismaTransaction.requestKey,
  //   //     node: prismaTransactionMapper(prismaTransaction, [], context),
  //   //   }));

  //   //   return {
  //   //     pageInfo: {
  //   //       hasNextPage,
  //   //       hasPreviousPage,
  //   //     },
  //   //     edges,
  //   //     totalCount,
  //   //   };
  //   // } catch (error) {
  //   //   throw normalizeError(error);
  //   // }
  // }),
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
