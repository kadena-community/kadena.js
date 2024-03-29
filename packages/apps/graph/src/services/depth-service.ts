import { prismaClient } from '@db/prisma-client';

const getLatestBlockHeights = async (chainIds?: string[]) =>
  await prismaClient.block.groupBy({
    by: ['chainId'],
    _max: {
      height: true,
    },
    ...(chainIds?.length && {
      where: {
        chainId: {
          in: chainIds.map((id) => parseInt(id)),
        },
      },
    }),
  });

export const getConditionForMinimumDepth = async (
  minimumDepth: number,
  chainIds?: string[],
): Promise<
  {
    chainId: bigint;
    height: {
      lte: number;
    };
  }[]
> =>
  (await getLatestBlockHeights(chainIds))
    .filter((x) => x._max.height !== null)
    .map((block) => ({
      chainId: block.chainId,
      height: {
        lte: parseInt((block._max.height as bigint).toString()) - minimumDepth,
      },
    }));
