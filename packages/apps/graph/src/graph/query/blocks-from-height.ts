import { prismaClient } from '@db/prisma-client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { chainIds as defaultChainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/block';

builder.queryField('blocksFromHeight', (t) =>
  t.prismaConnection({
    description: 'Retrieve blocks by chain and minimal height.',
    args: {
      startHeight: t.arg.int({ required: true }),
      chainIds: t.arg.stringList({ required: false }),
    },
    cursor: 'hash',
    type: Block,
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        first: args.first,
        last: args.last,
      }),
    }),
    async resolve(
      query,
      __parent,
      { startHeight, chainIds = defaultChainIds },
    ) {
      try {
        return await prismaClient.block.findMany({
          ...query,
          where: {
            height: {
              gte: startHeight,
            },
            ...(chainIds?.length && {
              chainId: {
                in: chainIds.map((x) => parseInt(x)),
              },
            }),
          },
          orderBy: {
            height: 'asc',
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
