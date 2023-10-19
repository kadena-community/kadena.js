import { Prisma } from '@prisma/client';
import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

builder.queryField('transactions', (t) => {
  return t.prismaConnection({
    args: {
      accountName: t.arg.string({ required: false }),
      moduleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
    },
    type: 'Transaction',
    cursor: 'blockHash_requestKey',
    resolve: (query, parent, args) => {
      const conditions: Prisma.TransactionWhereInput[] = [];
      const conditionsObj: Prisma.TransactionWhereInput = {};

      // conditionsObj.events = {
      //   some: {
      //     moduleName: args.moduleName,
      //   },
      //   }
      // }

      if (args.accountName) {
        conditions.push({
          senderAccount: args.accountName,
        });
      }

      if (args.moduleName) {
        conditions.push({
          events: {
            some: {
              moduleName: args.moduleName,
            },
          },
        });
      }

      if (args.chainId) {
        conditions.push({
          chainId: parseInt(args.chainId),
        });
      }

      return prismaClient.transaction.findMany({
        ...query,
        where: {
          AND: conditions,
        },
        orderBy: {
          height: 'desc',
        },
      });

      // return prismaClient.transaction.findMany({
      //   ...query,
      //   where: {
      //     senderAccount: args.accountName,
      //     events: {
      //       some: {
      //         moduleName: args.moduleName,
      //       },
      //     },
      //     ...(args.chainId && { chainId: parseInt(args.chainId) }),
      //   },
      //   orderBy: {
      //     height: 'desc',
      //   },
      // });
    },
  });
});
