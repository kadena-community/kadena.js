import { prismaClient } from '../../db/prismaClient';
import { dotenv } from '../../utils/dotenv';
import { nullishOrEmpty } from '../../utils/nullishOrEmpty';
import { builder } from '../builder';

import type { Block } from '@prisma/client';
import type { Debugger } from 'debug';
import _debug from 'debug';

const log: Debugger = _debug('graph:Subscription:newBlocks');

builder.subscriptionField('newBlocks', (t) => {
  return t.prismaField({
    args: {
      chainIds: t.arg.intList({ required: false }),
    },
    type: ['Block'],
    nullable: true,
    subscribe: (parent, args, context, info) =>
      iteratorFn(args.chainIds as number[] | undefined),
    // TODO: find out why this needs `as Block[]`
    // without it we get the error from
    resolve: (__, block) => block as Block[],
  });
});

async function* iteratorFn(
  chainIds: number[] = Array.from(new Array(dotenv.CHAIN_COUNT)).map(
    (__, i) => i,
  ),
): AsyncGenerator<Block[], void, unknown> {
  let lastBlock = (await getLastBlocks(chainIds))[0];

  yield [lastBlock];
  log('yielding initial block with id %s', lastBlock.id);

  while (true) {
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
    where: { ...extendedFilter.where, chainid: { in: chainIds } },
  });

  log("found '%s' blocks", foundblocks.length);

  return foundblocks;
}
