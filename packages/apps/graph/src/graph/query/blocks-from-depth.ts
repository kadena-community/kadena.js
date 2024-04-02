import { prismaClient } from '@db/prisma-client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { chainIds as defaultChainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/block';

builder.queryField('blocksFromDepth', (t) =>
  t.prismaConnection({
    description:
      'Retrieve blocks by chain and minimal depth. Default page size is 20.',
    args: {
      minimumDepth: t.arg.int({
        required: true,
        validate: {
          nonnegative: true,
        },
      }),
      chainIds: t.arg.stringList({
        required: false,
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
    nullable: true,
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        withRelations: true,
        first: args.first,
        last: args.last,
      }),
    }),
    // @ts-ignore
    async resolve(
      query,
      __parent,
      { minimumDepth, chainIds = defaultChainIds },
    ) {
      try {
        const latestBlocks = await prismaClient.block.groupBy({
          by: ['chainId'],
          _max: {
            height: true,
          },
          where: {
            chainId: {
              in: (chainIds as string[]).map((id) => parseInt(id)),
            },
          },
        });

        const pairs = latestBlocks
          .filter((x) => x._max.height !== null)
          .map((block) => ({
            chainId: block.chainId,
            height: {
              lte:
                parseInt((block._max.height as bigint).toString()) -
                minimumDepth,
            },
          }));

        return await prismaClient.block.findMany({
          ...query,
          where: {
            OR: pairs,
          },
          orderBy: [
            {
              height: 'desc',
            },
            {
              chainId: 'desc',
            },
            {
              id: 'desc',
            },
          ],
          select: {
            // @ts-ignore
            ...query.select,
            height: true,
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
