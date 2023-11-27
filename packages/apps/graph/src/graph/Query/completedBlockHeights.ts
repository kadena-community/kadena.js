import { prismaClient } from '@db/prismaClient';
import { chainIds as defaultChainIds } from '@utils/chains';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/Block';

builder.queryField('completedBlockHeights', (t) => {
  return t.prismaField({
    args: {
      completedHeights: t.arg.boolean({ required: false }),
      heightCount: t.arg.int({ required: false }),
      chainIds: t.arg.stringList({ required: false }),
    },

    type: [Block],

    async resolve(
      __query,
      __parent,
      {
        completedHeights: onlyCompleted = false,
        heightCount = 3,
        chainIds = defaultChainIds,
      },
    ) {
      try {
        if (onlyCompleted === true) {
          const completedHeights = (await prismaClient.$queryRaw`
            SELECT height
            FROM blocks b
            GROUP BY height
            HAVING COUNT(*) >= ${dotenv.CHAIN_COUNT} AND
            COUNT(CASE WHEN height = height THEN 1 ELSE NULL END) > 0
            ORDER BY height DESC
            LIMIT ${heightCount}
          `) as { height: number }[];

          if (completedHeights.length > 0) {
            return prismaClient.block.findMany({
              where: {
                AND: [
                  {
                    chainId: {
                      in: chainIds?.map((x) => parseInt(x)),
                    },
                  },
                  {
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
                ],
              },
            });
          }
        }

        const completedHeights = (await prismaClient.$queryRaw`
          SELECT height, COUNT(*)
          FROM blocks b
          GROUP BY height
          HAVING COUNT(*) > 1 AND
          COUNT(CASE WHEN height = height THEN 1 ELSE NULL END) > 0
          ORDER BY height DESC
          LIMIT ${heightCount}
        `) as { height: number }[];

        return prismaClient.block.findMany({
          where: {
            AND: [
              {
                chainId: {
                  in: chainIds?.map((x) => parseInt(x)),
                },
              },
              {
                height: {
                  in: completedHeights.map((h) => h.height),
                },
              },
            ],
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});
