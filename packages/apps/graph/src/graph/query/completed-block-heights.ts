import { prismaClient } from '@db/prisma-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { COMPLEXITY } from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { networkData } from '@utils/network';
import { builder } from '../builder';
import Block from '../objects/block';

builder.queryField('completedBlockHeights', (t) =>
  t.prismaConnection({
    description: `Retrieve all completed blocks from a given height. Default page size is ${dotenv.DEFAULT_PAGE_SIZE}.`,
    args: {
      completedHeights: t.arg.boolean({
        description:
          'Retrieve blocks from completed heights only. Default: true',
        required: false,
        defaultValue: true,
      }),
      heightCount: t.arg.int({
        required: false,
        defaultValue: 3,
        validate: {
          nonnegative: true,
        },
      }),
      chainIds: t.arg.stringList({
        defaultValue: [...CHAINS],
        description: 'Default: all chains',
        validate: {
          minLength: 1,
          items: {
            minLength: 1,
          },
        },
      }),
    },
    cursor: 'hash',
    type: Block,
    complexity: (args) => ({
      field:
        COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS *
        (args.heightCount as number) * // heightCount has a default value so cannot be null. Bug in pothos.
        4, // In the worst case resolve scenario, it executes 4 queries.
    }),
    async resolve(
      query,
      __parent,
      {
        completedHeights: completedHeightsArg,
        heightCount,
        chainIds = networkData.chainIds,
      },
    ) {
      try {
        if (completedHeightsArg) {
          const completedHeights = (await prismaClient.$queryRaw`
            SELECT height
            FROM blocks b
            GROUP BY height
            HAVING COUNT(*) >= ${networkData.chainIds.length} AND
            COUNT(CASE WHEN height = height THEN 1 ELSE NULL END) > 0
            ORDER BY height DESC
            LIMIT ${heightCount}
          `) as { height: number }[];

          if (completedHeights.length > 0) {
            return prismaClient.block.findMany({
              ...query,
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

        return await prismaClient.block.findMany({
          ...query,
          orderBy: {
            height: 'desc',
          },
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
  }),
);
