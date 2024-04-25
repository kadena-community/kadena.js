import { prismaClient } from '@db/prisma-client';
import { dotenv } from '@utils/dotenv';

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
          gte: Number(currentHeight) - 4,
        },
      },
      select: {
        creationTime: true,
        target: true,
      },
    });

    const blocksWithDifficulty: { creationTime: Date; difficulty: number }[] =
      [];

    for (const block of blocks) {
      const base = 2 ** 256;

      let difficulty = base / block.target.toNumber();

      blocksWithDifficulty.push({
        creationTime: block.creationTime,
        difficulty,
      });
    }

    function aggregateBlockData(
      blocks: { creationTime: Date; difficulty: number }[],
    ) {
      let earliestTime = Number.MAX_SAFE_INTEGER;
      let totalDifficulty = 0;

      for (const block of blocks) {
        const blockTimeMillis = block.creationTime.getTime();
        if (blockTimeMillis < earliestTime) {
          earliestTime = blockTimeMillis;
        }
        totalDifficulty += block.difficulty;
      }

      return { earliestTime, totalDifficulty };
    }

    const currentTimeMillis = Date.now();
    const { earliestTime, totalDifficulty } =
      aggregateBlockData(blocksWithDifficulty);

    const timeDifference = currentTimeMillis - earliestTime;

    let networkHashRate;

    // Check if the elapsed time is less than 1 second
    if (timeDifference < 1000) {
      networkHashRate = 0; // Not enough time has passed to calculate a meaningful hash rate
    } else {
      networkHashRate = totalDifficulty / (timeDifference / 1000);
    }

    return {
      networkHashRate: Number(networkHashRate),
      totalDifficulty: Number(totalDifficulty),
    };
  } catch (error) {
    throw new NetworkError('Unable to parse response data.', error);
  }
}
