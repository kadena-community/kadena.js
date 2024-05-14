import { prismaClient } from '@db/prisma-client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { chainIds as defaultChainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Block from '../objects/block';

builder.queryField('blocksFromHeight', (t) =>
  t.prismaConnection({
    description:
      'Retrieve blocks by chain and minimal height. Default page size is 20.',
    args: {
      startHeight: t.arg.int({
        required: true,
        validate: {
          nonnegative: true,
        },
      }),
      endHeight: t.arg.int({
        required: false,
        validate: {
          positive: true,
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
    validate(args) {
      if (args.endHeight && args.startHeight > args.endHeight) {
        return false;
      }
      return true;
    },
    cursor: 'hash',
    type: Block,
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        first: args.first,
        last: args.last,
      }),
    }),
    async resolve(
      query,
      __parent,
      { startHeight, chainIds = defaultChainIds, endHeight },
    ) {
      try {
        return await prismaClient.block.findMany({
          ...query,
          where: {
            height: {
              gte: startHeight,
              ...(endHeight && {
                lte: endHeight,
              }),
            },
            ...(chainIds?.length && {
              chainId: {
                in: chainIds.map((x) => parseInt(x)),
              },
            }),
          },
          orderBy: [
            {
              height: 'asc',
            },
            {
              chainId: 'asc',
            },
            {
              id: 'asc',
            },
          ],
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
