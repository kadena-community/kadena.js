import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

import { Block } from '@prisma/client';
import _debug, { Debugger } from 'debug';

const log: Debugger = _debug('graph:Subscription:newBlocks');

builder.subscriptionField('newBlocks', (t) => {
  return t.prismaField({
    type: ['Block'],
    nullable: true,
    subscribe: () => iteratorFn(),
    resolve: (__, block) => block,
  });
});

async function* iteratorFn(): AsyncGenerator<Block[], void, unknown> {
  let lastBlock = (await getLastBlocks())[0];

  yield [lastBlock];
  log('yielding initial block with id %s', lastBlock.id);

  while (true) {
    const newBlocks = await getLastBlocks(lastBlock.id);

    if (!nullishOrEmpty(newBlocks) && lastBlock.id !== newBlocks?.[0]?.id) {
      lastBlock = newBlocks[newBlocks.length - 1];
      yield newBlocks;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function getLastBlocks(id?: number): Promise<Block[]> {
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

  const foundblocks = await prismaClient.block.findMany({ ...extendedFilter });

  log("found '%s' blocks", foundblocks.length);

  return foundblocks;
}

function nullishOrEmpty(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return value === null || value === undefined;
}
