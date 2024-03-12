import { prismaClient } from '@db/prisma-client';
import { COMPLEXITY } from '@services/complexity';
import { chainIds as defaultChainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { PRISMA, builder } from '../builder';
import Block from '../objects/block';

builder.queryField('blocksFromHeight', (t) =>
  t.prismaField({
    description: 'Retrieve blocks by chain and minimal height.',
    args: {
      startHeight: t.arg.int({ required: true }),
      chainIds: t.arg.stringList({ required: false }),
    },
    type: [Block],
    complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS * PRISMA.DEFAULT_SIZE,
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
          take: PRISMA.DEFAULT_SIZE,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
