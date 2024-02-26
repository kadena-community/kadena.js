import { prismaClient } from '@db/prisma-client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { PRISMA, builder } from '../builder';
import Block from '../objects/block';

builder.queryField('blocksFromDepth', (t) =>
  t.prismaField({
    description: 'Retrieve blocks by chain and minimal depth.',
    args: {
      minimumDepth: t.arg.int({ required: true }),
      chainIds: t.arg.stringList({ required: true }),
    },
    type: [Block],
    nullable: true,
    complexity:
      (COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS +
        COMPLEXITY.FIELD.PRISMA_WITH_RELATIONS) *
      PRISMA.DEFAULT_SIZE,
    async resolve(query, __parent, { minimumDepth, chainIds }) {
      try {
        const blocksArray = await Promise.all(
          chainIds.map(async (chainId) => {
            const latestBlock = await prismaClient.block.findFirst({
              where: {
                chainId: parseInt(chainId),
              },
              orderBy: {
                height: 'desc',
              },
              select: {
                height: true,
              },
            });

            if (!latestBlock) return [];

            return prismaClient.block.findMany({
              ...query,
              where: {
                chainId: parseInt(chainId),
                height: {
                  lte: parseInt(latestBlock.height.toString()) - minimumDepth,
                },
              },
              orderBy: [
                {
                  height: 'desc',
                },
                { creationTime: 'desc' },
              ],
              take: PRISMA.DEFAULT_SIZE,
              select: {
                ...query.select,
                height: true,
              },
            });
          }),
        );

        const blocks = blocksArray
          .flat()
          .sort(
            (a, b) =>
              parseInt(b.height.toString()) - parseInt(a.height.toString()),
          )
          .slice(0, PRISMA.DEFAULT_SIZE);

        return blocks;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
