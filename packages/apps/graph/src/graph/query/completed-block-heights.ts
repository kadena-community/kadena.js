import { prismaClient } from '@db/prisma-client';
import { COMPLEXITY } from '@services/complexity';
import { chainIds as defaultChainIds } from '@utils/chains';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/block';

builder.queryField('completedBlockHeights', (t) =>
  t.prismaConnection({
    description:
      'Retrieve all completed blocks from a given height. Default page size is 20.',
    args: {
      completedHeights: t.arg.boolean({
        required: false,
        defaultValue: false,
      }),
      heightCount: t.arg.int({
        required: false,
        defaultValue: 3,
        validate: {
          nonnegative: true,
        },
      }),
      chainIds: t.arg.stringList({
        required: false,
        defaultValue: defaultChainIds,
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
    async resolve(query, __parent, args) {
      try {
        if (args.completedHeights) {
          const completedHeights = (await prismaClient.$queryRaw`
            SELECT height
            FROM blocks b
            GROUP BY height
            HAVING COUNT(*) >= ${dotenv.CHAIN_COUNT} AND
            COUNT(CASE WHEN height = height THEN 1 ELSE NULL END) > 0
            ORDER BY height DESC
            LIMIT ${args.heightCount}
          `) as { height: number }[];

          if (completedHeights.length > 0) {
            return prismaClient.block.findMany({
              ...query,
              where: {
                AND: [
                  {
                    chainId: {
                      in: args.chainIds?.map((x) => parseInt(x)),
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
          LIMIT ${args.heightCount}
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
                  in: args.chainIds?.map((x) => parseInt(x)),
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
