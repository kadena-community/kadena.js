import { prismaClient } from '@db/prisma-client';
import type { Block } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import {
  getConditionForMinimumDepth,
  getConfirmationDepth,
} from '@services/depth-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import GQLBlock from '../objects/block';

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
    type: GQLBlock,
    nullable: true,
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        withRelations: true,
        first: args.first,
        last: args.last,
        minimumDepth: args.minimumDepth,
      }),
    }),
    // @ts-ignore
    async resolve(query, __parent, { minimumDepth, chainIds }) {
      try {
        let blocks: Block[] = [];
        let skip = 0;
        const take = query.take;

        while (blocks.length < take) {
          const remaining = take - blocks.length;
          const fetchedBlocks = await prismaClient.block.findMany({
            ...query,
            where: {
              OR: await getConditionForMinimumDepth(
                minimumDepth,
                chainIds ? chainIds : undefined,
              ),
            },
            orderBy: [{ height: 'desc' }, { chainId: 'desc' }, { id: 'desc' }],
            take: remaining,
            skip,
          });

          if (fetchedBlocks.length === 0) {
            break;
          }

          if (minimumDepth) {
            const confirmationDepths = await Promise.all(
              fetchedBlocks.map((block) => getConfirmationDepth(block.hash)),
            );

            const filteredBlocks = fetchedBlocks.filter(
              (__block, index) => confirmationDepths[index] >= minimumDepth,
            );

            blocks = [...blocks, ...filteredBlocks];
          } else {
            blocks = [...blocks, ...fetchedBlocks];
          }

          skip += remaining;
        }

        return blocks.slice(0, take);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
