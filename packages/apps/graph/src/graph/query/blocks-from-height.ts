import { prismaClient } from '@db/prisma-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { networkData } from '@utils/network';
import { ZodError } from 'zod';
import { builder } from '../builder';
import Block from '../objects/block';

builder.queryField('blocksFromHeight', (t) =>
  t.prismaConnection({
    description: `Retrieve blocks by chain and minimal height. Default page size is ${dotenv.DEFAULT_PAGE_SIZE}.`,
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
      field: getDefaultConnectionComplexity({
        first: args.first,
        last: args.last,
      }),
    }),
    async resolve(
      query,
      __parent,
      { startHeight, chainIds = networkData.chainIds, endHeight },
    ) {
      try {
        if (endHeight && startHeight > endHeight) {
          throw new ZodError([
            {
              code: 'custom',
              message: 'startHeight must be lower than endHeight',
              path: ['blocksFromHeight'],
            },
          ]);
        }

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
