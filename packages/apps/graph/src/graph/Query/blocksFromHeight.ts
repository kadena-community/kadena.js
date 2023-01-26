import { prismaClient } from '../../db/prismaClient';
import { dotenv } from '../../utils/dotenv';
import { builder } from '../builder';
import Block from '../objects/Block';

builder.queryField('blocksFromHeight', (t) => {
  return t.prismaField({
    args: {
      startHeight: t.arg.int({ required: true }),
      chainIds: t.arg.intList({ required: false }),
    },

    type: [Block],

    resolve: async (
      __query,
      __parent,
      {
        startHeight,
        chainIds = Array.from(new Array(dotenv.CHAIN_COUNT)).map((__, i) => i),
      },
    ) => {
      return prismaClient.block.findMany({
        where: {
          AND: [
            {
              height: {
                gte: startHeight,
              },
            },
            {
              chainid: {
                in: chainIds as number[],
              },
            },
          ],
        },
      });
    },
  });
});
