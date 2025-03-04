import { prismaClient } from '@db/prisma-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import type { Block } from '@prisma/client';
import { networkData } from '@utils/network';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import type { IContext } from '../builder';
import { builder } from '../builder';
import GQLBlock from '../objects/block';

builder.subscriptionField('newBlocks', (t) =>
  t.field({
    description: 'Subscribe to new blocks.',
    args: {
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
    type: [GQLBlock],
    nullable: true,
    subscribe: async (__root, args, context) =>
      iteratorFn(
        args.chainIds?.length ? args.chainIds : networkData.chainIds,
        context,
      ),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  chainIds: string[],
  context: IContext,
): AsyncGenerator<Block[], void, unknown> {
  const startingTimestamp = new Date().toISOString();
  const blockResult = await getLastBlocks(chainIds, startingTimestamp);

  let lastBlock;

  if (!nullishOrEmpty(blockResult)) {
    lastBlock = blockResult[0];
    yield [];
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
  chainIds: string[],
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
    where: {
      ...extendedFilter.where,
      chainId: { in: chainIds.map((x) => parseInt(x)) },
    },
  });

  return foundblocks.sort((a, b) => b.id - a.id);
}
