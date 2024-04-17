import { getCirculatingCoins, getTransactionCount } from '@services/network';
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
        return {
          networkHost: dotenv.NETWORK_HOST,
          networkId: networkData.networkId,
          apiVersion: networkData.apiVersion,
          circulatingCoins: await getCirculatingCoins(),
          totalTransactions: await getTransactionCount(),
        };
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
