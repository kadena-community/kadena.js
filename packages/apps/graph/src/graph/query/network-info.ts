import {
  getHashRateAndTotalDifficulty,
  getNetworkStatistics,
} from '@services/network';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { networkData } from '@utils/network';
import { builder } from '../builder';

builder.queryField('networkInfo', (t) =>
  t.field({
    description: 'Get information about the network.',
    type: 'NetworkInfo',
    nullable: true,
    async resolve() {
      try {
        const { networkId, apiVersion } = networkData;

        const [
          { coinsInCirculation, transactionCount },
          { networkHashRate, totalDifficulty },
        ] = await Promise.all([
          getNetworkStatistics(),
          getHashRateAndTotalDifficulty(),
        ]);

        return {
          networkHost: dotenv.NETWORK_HOST,
          networkId,
          apiVersion,
          coinsInCirculation,
          transactionCount,
          networkHashRate,
          totalDifficulty,
        };
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
