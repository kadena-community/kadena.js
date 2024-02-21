import { prismaClient } from '@db/prisma-client';
import { createID } from '@utils/global-id';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import type { IContext } from '../builder';
import { PRISMA, builder } from '../builder';
import GQLBlock from '../objects/block';

builder.subscriptionField('newBlocksFromDepth', (t) =>
  t.field({
    description: 'Subscribe to new blocks from a specific depth.',
    type: ['ID'],
    args: {
      minimumDepth: t.arg.int({ required: true }),
      chainIds: t.arg.stringList({ required: true }),
    },
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(args.chainIds, args.minimumDepth, context),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  chainIds: string[],
  minimumDepth: number,
  context: IContext,
): AsyncGenerator<string[], void, unknown> {
  const startingTimestamp = new Date().toISOString();
  const blockResult = await getLastBlocksWithDepth(
    chainIds,
    minimumDepth,
    startingTimestamp,
  );
  let lastBlock;

  if (!nullishOrEmpty(blockResult)) {
    lastBlock = blockResult[0];
    yield [createID(GQLBlock.name, lastBlock.hash)];
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
      yield newBlocks.map((block) => createID(GQLBlock.name, block.hash));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastBlocksWithDepth(
  chainIds: string[],
  minimumDepth: number,
  date: string,
  id?: number,
): Promise<{ id: number; hash: string }[]> {
  const blocksArray = await Promise.all(
    chainIds.map(async (chainId) => {
      const latestBlock = await prismaClient.block.findFirst({
        where: {
          chainId: parseInt(chainId),
        },
        orderBy: {
          height: 'desc',
        },
        select: {
          height: true,
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

  const blocks = blocksArray
    .flat()
    .sort(
      (a, b) => parseInt(b.height.toString()) - parseInt(a.height.toString()),
    )
    .slice(0, PRISMA.DEFAULT_SIZE);

  return blocks;
}
