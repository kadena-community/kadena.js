import axios from 'axios';
import {
  defaultHeader,
  DefaultQueryParams,
  queryParamsTypeAdapter,
  switchBetweenConfig,
} from 'utils/api';
import { MAIN_NETWORK_API_URL } from 'config/Constants';
import { APIRemoteRoute } from 'config/Routes';

export interface ChainStatsResponseData {
  totalTransactions: number;
  circulatingSupply: number;
}

const apiStatsAdapter = (apiStatsResponseData: any) => {
  return {
    circulatingSupply: apiStatsResponseData.coinsInCirculation,
    totalTransactions: apiStatsResponseData.transactionCount,
  } as ChainStatsResponseData;
};

export async function getStatInfo(
  query: DefaultQueryParams,
): Promise<ChainStatsResponseData | null> {
  // @ts-expect-error Property 'network' does not exist on type '{}'.
  const { network } = queryParamsTypeAdapter(query);
  if (!network) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      return {
        totalTransactions: 0,
        circulatingSupply: 0,
      };
    },
    async () => {
      const mainNetStatsResponse = await axios.get(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.Stats}`,
        {
          headers: defaultHeader,
        },
      );
      const { totalTransactions, circulatingSupply } = apiStatsAdapter(
        mainNetStatsResponse.data,
      );
      return {
        totalTransactions,
        circulatingSupply,
      };
    },
    () => {
      return null;
    },
  );
}
