import { prismaClient } from '@db/prisma-client';
import { dotenv } from '@utils/dotenv';
import { networkData } from '@utils/network';

interface IBlockWithDifficulty {
  creationTime: Date;
  difficulty: bigint;
  height: bigint;
  chainId: bigint;
}

interface IBlockGroup {
  [key: string]: IBlockWithDifficulty[];
}

export class NetworkError extends Error {
  public networkError?: Error;

  public constructor(message: string, networkError?: Error) {
    super(message);
    this.networkError = networkError;
  }
}

export interface INetworkStatistics {
  coinsInCirculation: number;
  transactionCount: number;
}

export async function getNetworkStatistics(): Promise<INetworkStatistics> {
  try {
    const stats: INetworkStatistics = await (
      await fetch(`${dotenv.NETWORK_STATISTICS_URL}`)
    ).json();

    if (stats.transactionCount < 0) stats.transactionCount = 0;

    return stats;
  } catch (error) {
    throw new NetworkError('Unable to parse response data.', error);
  }
}

export async function getHashRateAndTotalDifficulty(): Promise<{
  networkHashRate: number;
  totalDifficulty: number;
}> {
  try {
    // Retrieve the blocks.
    const { height: currentHeight } = await prismaClient.block.findFirstOrThrow(
      {
        orderBy: {
          height: 'desc',
        },
        select: {
          height: true,
        },
        take: 1,
      },
    );

    const blocks = await prismaClient.block.findMany({
      where: {
        height: {
          gte: Number(currentHeight) - 4, //it was verified that with 3 heights sometimes we did not have 20 blocks
        },
      },
      select: {
        creationTime: true,
        target: true,
        height: true,
        chainId: true,
      },
    });

    // Transform the data and calculate the difficulty per block.
    const blocksWithDifficulty: IBlockWithDifficulty[] = [];

    for (const block of blocks) {
      blocksWithDifficulty.push({
        creationTime: block.creationTime,
        difficulty: 2n ** 256n / BigInt(block.target.round().toFixed()),
        height: block.height,
        chainId: block.chainId,
      });
    }

    // Calculate the data and return it.
    return {
      networkHashRate: Number(calculateNetworkHashRate(blocksWithDifficulty)),
      totalDifficulty: Number(
        calculateTotalDiffulty(currentHeight, blocksWithDifficulty),
      ),
    };
  } catch (error) {
    throw new NetworkError('Unable to parse response data.', error);
  }
}

function calculateNetworkHashRate(
  blocksWithDifficulty: IBlockWithDifficulty[],
): bigint {
  function aggregateBlockData(
    blocks: { creationTime: Date; difficulty: bigint }[],
  ): { earliestTime: number; totalDifficulty: bigint } {
    let earliestTime = Number.MAX_SAFE_INTEGER;
    let totalDifficulty = 0n;

    for (const block of blocks) {
      const blockTimeMillis = block.creationTime.getTime();
      if (blockTimeMillis < earliestTime) {
        earliestTime = blockTimeMillis;
      }
      totalDifficulty += block.difficulty;
    }

    return { earliestTime, totalDifficulty };
  }

  const { earliestTime, totalDifficulty } =
    aggregateBlockData(blocksWithDifficulty);

  const timeDifference = Date.now() - earliestTime;

  return timeDifference < 1000
    ? 0n
    : totalDifficulty / (BigInt(timeDifference) / 1000n);
}

function calculateTotalDiffulty(
  currentHeight: bigint,
  blocks: IBlockWithDifficulty[],
): bigint | undefined {
  for (let i = currentHeight; i > currentHeight - 4n; i--) {
    const blocksOfThisHeight = blocks.filter((block) => block.height === i);

    if (blocksOfThisHeight.length === networkData.chainIds.length) {
      return blocksOfThisHeight.reduce(
        (acc, block) => acc + block.difficulty,
        0n,
      );
      // Deal with the case where we have orphan blocks.
    } else if (blocksOfThisHeight.length > networkData.chainIds.length) {
      // Group blocks by chainId
      const blocksGroupedByChainId = blocksOfThisHeight.reduce<IBlockGroup>(
        (acc, block) => {
          const chainIdKey = block.chainId.toString();
          if (!acc[chainIdKey]) {
            acc[chainIdKey] = [];
          }
          acc[chainIdKey].push(block);
          return acc;
        },
        {},
      );

      // Calculate total difficulty
      let totalDifficulty = 0n;
      for (const chainId of networkData.chainIds) {
        const blocks = blocksGroupedByChainId[chainId.toString()];
        if (blocks) {
          const chainDifficulty = blocks.reduce(
            (acc, block) => acc + block.difficulty,
            0n,
          );

          // If there are multiple blocks, we average their difficulties.
          totalDifficulty += chainDifficulty / BigInt(blocks.length);
        }
      }
      return totalDifficulty;
    }
  }
}
