import { prismaClient } from '@db/prisma-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import type { Block } from '@prisma/client';
import { createBlockDepthMap } from '@services/depth-service';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import type { IContext } from '../builder';
import { builder } from '../builder';
import GQLBlock from '../objects/block';

builder.subscriptionField('newBlocksFromDepth', (t) =>
  t.field({
    description: 'Subscribe to new blocks from a specific depth.',
    type: [GQLBlock],
    args: {
      minimumDepth: t.arg.int({
        required: true,
        validate: {
          nonnegative: true,
        },
      }),
      chainIds: t.arg.stringList({
        defaultValue: [...CHAINS],
        validate: {
          minLength: 1,
          items: {
            minLength: 1,
          },
        },
      }),
    },
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(args.chainIds as string[], args.minimumDepth, context),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  chainIds: string[],
  minimumDepth: number,
  context: IContext,
): AsyncGenerator<Block[], void, unknown> {
  const startingTimestamp = new Date().toISOString();
  const blockResult = await getLastBlocksWithDepth(
    chainIds,
    minimumDepth,
    startingTimestamp,
  );

  let lastBlock;

  if (!nullishOrEmpty(blockResult)) {
    lastBlock = blockResult[0];
    yield [];
  }

  while (!context.req.socket.destroyed) {
    const newBlocks = await getLastBlocksWithDepth(
      chainIds,
      minimumDepth,
      startingTimestamp,
      lastBlock?.id,
    );

    if (!nullishOrEmpty(newBlocks)) {
      lastBlock = newBlocks[0];
      yield newBlocks;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastBlocksWithDepth(
  chainIds: string[],
  minimumDepth: number,
  date: string,
  id?: number,
): Promise<Block[]> {
  const blocks = await Promise.all(
    chainIds.map(async (chainId) => {
      const latestBlock = await prismaClient.block.findFirst({
        where: {
          chainId: parseInt(chainId),
        },
        orderBy: {
          height: 'desc',
        },
      });

      if (!latestBlock) return [];

      const defaultFilter: Parameters<typeof prismaClient.block.findMany>[0] = {
        orderBy: [
          {
            height: 'desc',
          },
          {
            creationTime: 'desc',
          },
        ],
      };

      const extendedFilter =
        id === undefined
          ? {
              take: 5,
              ...defaultFilter,
            }
          : {
              take: 100,
              ...defaultFilter,
              where: {
                id: { gt: id },
              },
            };

      return prismaClient.block.findMany({
        ...extendedFilter,
        where: {
          ...extendedFilter.where,
          chainId: parseInt(chainId),
          height: {
            lte: parseInt(latestBlock.height.toString()) - minimumDepth,
          },
          creationTime: { gt: date },
        },
      });
    }),
  );

  const blocksToReturn = blocks.flat();

  const blockHashToDepth = await createBlockDepthMap(blocksToReturn, 'hash');

  return blocksToReturn.filter(
    (block) => blockHashToDepth[block.hash] >= minimumDepth,
  );
}
