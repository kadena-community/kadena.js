import { prismaClient } from '@db/prismaClient';
import { COMPLEXITY } from '@services/complexity';
import { chainIds as defaultChainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { PRISMA, builder } from '../builder';
import Block from '../objects/Block';

builder.queryField('blocksFromHeight', (t) =>
  t.prismaField({
    description: 'Find all blocks from a given height.',
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
            AND: [
              {
                height: {
                  gte: startHeight,
                },
              },
              {
                chainId: {
                  in: chainIds?.map((x) => parseInt(x)),
                },
              },
            ],
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
