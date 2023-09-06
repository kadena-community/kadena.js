import { prismaClient } from '../../db/prismaClient';
import { dotenv } from '../../utils/dotenv';
import { builder } from '../builder';
import Block from '../objects/Block';

import type { Debugger } from 'debug';
import _debug from 'debug';

const log: Debugger = _debug('graph:Query:completedBlockHeights');

builder.queryField('completedBlockHeights', (t) => {
  return t.prismaField({
    args: {
      completedHeights: t.arg.boolean({ required: false }),
      heightCount: t.arg.int({ required: false }),
      chainIds: t.arg.stringList({ required: false }),
    },

    type: [Block],

    resolve: async (
      __query,
      __parent,
      { completedHeights: onlyCompleted = false, heightCount = 3 },
    ) => {
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

        log("found '%s' blocks", completedHeights.length);

        if (completedHeights.length > 0) {
          return prismaClient.block.findMany({
            where: {
              AND: [
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
                LIMIT ${heightCount}
              `,
          },
        },
      });
    },
  });
});
