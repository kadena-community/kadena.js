import { prismaClient } from '@db/prismaClient';
import { chainIds as defaultChainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/Block';

builder.queryField('blocksFromHeight', (t) => {
  return t.prismaField({
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
  });
});
