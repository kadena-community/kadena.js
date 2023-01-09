import { env } from '../../utils/dotenv';
import { prismaClient } from '../../utils/prismaClient';
import { builder } from '../builder';
import Block from '../objects/Block';

builder.queryField('blocks', (t) => {
  return t.prismaField({
    args: {
      completedHeights: t.arg.boolean({ required: false }),
      count: t.arg.int({ required: false }),
    },

    type: [Block],

    resolve: async (
      __query,
      __parent,
      { completedHeights: onlyCompleted = true, count = 3 },
    ) => {
      const completedHeights = (await prismaClient.$queryRaw`
        SELECT height
        FROM blocks b
        GROUP BY height
        HAVING COUNT(*) >= ${env.CHAIN_COUNT} AND
        COUNT(CASE WHEN height = height THEN 1 ELSE NULL END) > 0
        ORDER BY height DESC
        LIMIT ${count}
      `) as { height: number }[];

      if (onlyCompleted === true) {
        return prismaClient.block.findMany({
          where: {
            OR: [
              {
                height: {
                  in: completedHeights.map((h) => h.height),
                },
              },
              {
                height: {
                  gt: completedHeights[0].height,
                },
              },
            ],
          },
        });
      }

      return prismaClient.block.findMany({
        where: {
          height: {
            in: await prismaClient.$queryRaw`
                SELECT height, COUNT(*)
                FROM blocks b
                GROUP BY height
                HAVING COUNT(*) > 1 AND
                COUNT(CASE WHEN height = height THEN 1 ELSE NULL END) > 0
                ORDER BY height DESC
                LIMIT ${count}
              `,
          },
        },
      });
    },
  });
});
