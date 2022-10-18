import axios from 'axios';
import {
  defaultHeader,
  DefaultQueryParams,
  queryParamsTypeAdapter,
  switchBetweenConfig,
  TransactionDetail,
  TransactionStatus,
} from '../utils/api';
import { MAIN_NETWORK_API_URL } from '../config/Constants';
import { APIRemoteRoute } from '../config/Routes';

export interface RecentResponseData {
  transactions: TransactionDetail[];
}

const apiRecentTransactionsAdapter = (apiResponseData: any[]) => {
  return (apiResponseData || []).map(
    ({ result, chain, code, txid, ...restData }) => ({
      ...restData,
      chainId: chain,
      preview: code,
      status: result as TransactionStatus,
      id: txid,
    }),
  ) as TransactionDetail[];
};

export async function getRecentInfo(
  query: DefaultQueryParams,
): Promise<RecentResponseData | null> {
  const { network } = queryParamsTypeAdapter(query);
  if (!network) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      return {
        transactions: [],
      };
    },
    async () => {
      const mainNetConfigResponse = await axios.get(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Recent}`,
        {
          headers: defaultHeader,
        },
      );
      const recentTransactions = apiRecentTransactionsAdapter(
        mainNetConfigResponse.data,
      );
      return {
        transactions: recentTransactions,
      };
    },
    () => {
      return null;
    },
  );
}
