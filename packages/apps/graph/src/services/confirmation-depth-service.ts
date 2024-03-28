import { prismaClient } from '@db/prisma-client';

export async function getLatestBlockHeights(chainIds?: string[]) {
  return await prismaClient.block.groupBy({
    by: ['chainId'],
    _max: {
      height: true,
    },
    where: {
      chainId: {
        in: (chainIds as string[]).map((id) => parseInt(id)),
      },
    },
  });
}

export async function getConditionForMinimumDepth(
  minimumDepth: number,
  chainIds?: string[],
): Promise<
  {
    chainId: bigint;
    height: {
      lte: number;
    };
  }[]
> {
  const latestBlocks = await prismaClient.block.groupBy({
    by: ['chainId'],
    _max: {
      height: true,
    },
    where: {
      chainId: {
        in: (chainIds as string[]).map((id) => parseInt(id)),
      },
    },
  });

  return latestBlocks
    .filter((x) => x._max.height !== null)
    .map((block) => ({
      chainId: block.chainId,
      height: {
        lte: parseInt((block._max.height as bigint).toString()) - minimumDepth,
      },
    }));
}
