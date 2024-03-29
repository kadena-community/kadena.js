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

export async function getConfirmationDepth(blockHash: string): Promise<number> {
  const result = await prismaClient.$queryRaw<{ depth: number }[]>`
        WITH RECURSIVE BlockDescendants AS (
          SELECT hash, parent, 0 AS depth, height, chainid
          FROM blocks
          WHERE hash = ${blockHash}
          UNION ALL
          SELECT b.hash, b.parent, d.depth + 1 AS depth, b.height, b.chainid
          FROM BlockDescendants d
          JOIN blocks b ON d.hash = b.parent AND b.height = d.height + 1 AND b.chainid = d.chainid
          WHERE d.depth <= 6
        )
        SELECT MAX(depth) AS depth
        FROM BlockDescendants;
      `;

  if (result.length && result[0].depth) {
    return Number(result[0].depth);
  } else {
    return 0;
  }
}
