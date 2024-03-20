import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transfer', (t) =>
  t.prismaField({
    description: 'Retrieve one transfer by its unique key.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
      orderIndex: t.arg.int({ required: true }),
      moduleHash: t.arg.string({ required: true }),
      requestKey: t.arg.string({ required: true }),
    },
    type: Prisma.ModelName.Transfer,
    complexity: getDefaultConnectionComplexity(),
    async resolve(query, __parent, args) {
      try {
        return await prismaClient.transfer.findUnique({
          ...query,
          where: {
            blockHash_chainId_orderIndex_moduleHash_requestKey: {
              blockHash: args.blockHash,
              chainId: parseInt(args.chainId),
              orderIndex: args.orderIndex,
              moduleHash: args.moduleHash,
              requestKey: args.requestKey,
            },
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
