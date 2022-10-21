import axios from 'axios';
import {
  defaultHeader,
  DefaultQueryParams,
  queryParamsTypeAdapter,
  switchBetweenConfig,
  TransactionDetail,
  TransactionStatus,
} from '../utils/api';
import {
  MAIN_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { APIRemoteRoute } from '../config/Routes';

interface TransactionQueryParams extends DefaultQueryParams {
  requestKey: string;
}

const apiTransactionAdapter = (apiResponseData: any[]) => {
  if (!apiResponseData || apiResponseData.length === 0) {
    return null;
  }
  const { result, chain, code, txid, success, ...restData } =
    apiResponseData[0];
  return {
    ...restData,
    chainId: chain,
    preview: code,
    status: success ? TransactionStatus.Success : TransactionStatus.Fail,
    id: txid,
  } as TransactionDetail;
};

export async function getTransactionInfo(
  query: TransactionQueryParams,
): Promise<TransactionDetail | null> {
  const { network, requestKey } =
    queryParamsTypeAdapter<TransactionQueryParams>(query);
  if (!network || !requestKey) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      const testNetConfigResponse = await axios.get(
        `${TEST_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Txs}`,
        {
          params: {
            requestkey: requestKey,
          },
          headers: defaultHeader,
        },
      );
      return apiTransactionAdapter(testNetConfigResponse.data);
    },
    async () => {
      const mainNetConfigResponse = await axios.get(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Txs}`,
        {
          params: {
            requestkey: requestKey,
          },
          headers: defaultHeader,
        },
      );
      return apiTransactionAdapter(mainNetConfigResponse.data);
    },
    () => {
      return null;
    },
  );
}
