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
