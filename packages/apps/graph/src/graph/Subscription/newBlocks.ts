import { prismaClient } from '@db/prismaClient';
import type { Block } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import { nullishOrEmpty } from '@utils/nullishOrEmpty';
import type { IContext } from '../builder';
import { builder } from '../builder';

builder.subscriptionField('newBlocks', (t) =>
  t.prismaField({
    description: 'Subscribe to new blocks.',
    args: {
      chainIds: t.arg.intList({ required: false }),
    },
    type: ['Block'],
    nullable: true,
    subscribe: (__parent, args, context) =>
      iteratorFn(args.chainIds as number[] | undefined, context),
    resolve: (__query, parent) => parent as Block[],
  }),
);

async function* iteratorFn(
  chainIds: number[] = Array.from(new Array(dotenv.CHAIN_COUNT)).map(
    (__, i) => i,
  ),
  context: IContext,
): AsyncGenerator<Block[], void, unknown> {
  let lastBlock = (await getLastBlocks(chainIds))[0];

  yield [lastBlock];

  while (!context.req.socket.destroyed) {
    const newBlocks = await getLastBlocks(chainIds, lastBlock.id);

    if (!nullishOrEmpty(newBlocks) && lastBlock.id !== newBlocks?.[0]?.id) {
      lastBlock = newBlocks[newBlocks.length - 1];
      yield newBlocks;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastBlocks(
  chainIds: number[],
  id?: number,
): Promise<Block[]> {
  const defaultFilter: Parameters<typeof prismaClient.block.findMany>[0] = {
    orderBy: {
      id: 'desc',
    },
  } as const;

  const extendedFilter =
    id === undefined
      ? { take: 1, ...defaultFilter }
      : {
          take: 500,
          where: { id: { gt: id } },
        };

  const foundblocks = await prismaClient.block.findMany({
    ...extendedFilter,
    where: { ...extendedFilter.where, chainId: { in: chainIds } },
  });

  return foundblocks;
}
