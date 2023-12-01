import { prismaClient } from '@db/prismaClient';
import { chainIds as defaultChainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/Block';

builder.queryField('blocksFromHeight', (t) =>
  t.prismaField({
    description: 'Find all blocks from a given height.',
    args: {
      startHeight: t.arg.int({ required: true }),
      chainIds: t.arg.stringList({ required: false }),
    },
    type: [Block],
    async resolve(
      __query,
      __parent,
      { startHeight, chainIds = defaultChainIds },
    ) {
      try {
        const blocksFromHeight = await prismaClient.block.findMany({
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
          take: 100,
        });

        return blocksFromHeight;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
