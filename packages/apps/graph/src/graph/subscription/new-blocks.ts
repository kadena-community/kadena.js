import { prismaClient } from '@db/prisma-client';
import type { Block } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import type { IContext } from '../builder';
import { builder } from '../builder';
import GQLBlock from '../objects/block';

builder.subscriptionField('newBlocks', (t) =>
  t.field({
    description: 'Subscribe to new blocks.',
    args: {
      chainIds: t.arg.intList({ required: false }),
    },
    type: [GQLBlock],
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(args.chainIds as number[] | undefined, context),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  chainIds: number[] = Array.from(new Array(dotenv.CHAIN_COUNT)).map(
    (__, i) => i,
  ),
  context: IContext,
): AsyncGenerator<Block[], void, unknown> {
  const startingTimestamp = new Date().toISOString();
  const blockResult = await getLastBlocks(chainIds, startingTimestamp);
  let lastBlock;

  if (!nullishOrEmpty(blockResult)) {
    lastBlock = blockResult[0];
    yield [lastBlock];
  }

  while (!context.req.socket.destroyed) {
    const newBlocks = await getLastBlocks(
      chainIds,
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

async function getLastBlocks(
  chainIds: number[],
  date: string,
  id?: number,
): Promise<Block[]> {
  const defaultFilter: Parameters<typeof prismaClient.block.findMany>[0] = {
    orderBy: {
      id: 'desc',
    },
  } as const;

  const extendedFilter =
    id === undefined
      ? { take: 5, ...defaultFilter }
      : {
          take: 100,
          where: {
            AND: {
              id: { gt: id },
              creationTime: { gt: date },
            },
          },
        };

  const foundblocks = await prismaClient.block.findMany({
    ...extendedFilter,
    where: { ...extendedFilter.where, chainId: { in: chainIds } },
  });

  return foundblocks.sort((a, b) => b.id - a.id);
}
