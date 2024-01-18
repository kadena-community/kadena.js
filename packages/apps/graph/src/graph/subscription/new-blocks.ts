import { prismaClient } from '@db/prisma-client';
import { dotenv } from '@utils/dotenv';
import { createID } from '@utils/global-id';
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
    type: ['ID'],
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
): AsyncGenerator<string[], void, unknown> {
  const blockResult = await getLastBlocks(chainIds);
  let lastBlock;

  if (!nullishOrEmpty(blockResult)) {
    lastBlock = blockResult[0];
    yield [createID(GQLBlock.name, lastBlock.hash)];
  }

  while (!context.req.socket.destroyed) {
    const newBlocks = await getLastBlocks(chainIds, lastBlock?.id);

    if (!nullishOrEmpty(newBlocks)) {
      lastBlock = newBlocks[0];
      yield newBlocks.map((block) => createID(GQLBlock.name, block.hash));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastBlocks(
  chainIds: number[],
  id?: number,
): Promise<{ id: number; hash: string }[]> {
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
          where: { id: { gt: id } },
        };

  const foundblocks = await prismaClient.block.findMany({
    ...extendedFilter,
    where: { ...extendedFilter.where, chainId: { in: chainIds } },
    select: {
      id: true,
      hash: true,
    },
  });

  return foundblocks.sort((a, b) => b.id - a.id);
}
