import axios from 'axios';
import {
  DefaultQueryParams,
  jsonHeader,
  queryParamsTypeAdapter,
  switchBetweenConfig,
  TransactionStatus,
} from '../utils/api';
import {
  MAIN_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { APIRemoteRoute } from '../config/Routes';

interface SearchQueryParams extends DefaultQueryParams {
  accountName: string;
  customHost?: string;
}

export interface HistoryResult {
  requestKey: string;
  status: string;
  date: string;
}

const getHistoryAdapter = (apiResponseData?: any[]) => {
  return [
    ...(apiResponseData || []).map(
      ({ requestKey, code, creationTime, ...restProps }: any) => ({
        requestKey,
        subTitle: code,
        date: creationTime,
        status:
          restProps?.result === TransactionStatus.Success
            ? 'success'
            : restProps?.result === TransactionStatus.Fail
            ? 'failed'
            : 'pending',
      }),
    ),
  ] as HistoryResult[];
};

export async function getSearchInfo(
  queryParams: SearchQueryParams,
): Promise<HistoryResult[] | null> {
  const { network, customHost, accountName } =
    queryParamsTypeAdapter<SearchQueryParams>(queryParams);
  if (!accountName || !network) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      let accountHistoryResponse: any;

      try {
        accountHistoryResponse = await axios.get(
          `${TEST_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Search}`,
          {
            params: {
              search: accountName,
              limit: 50,
              offset: 0,
            },
            headers: jsonHeader,
          },
        );
        // eslint-disable-next-line no-empty
      } catch (e) {}

      return getHistoryAdapter(accountHistoryResponse?.data);
    },
    async () => {
      let accountHistoryResponse: any;

      try {
        accountHistoryResponse = await axios.get(
          `${MAIN_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Search}`,
          {
            params: {
              search: accountName,
              limit: 10,
              offset: 0,
            },
            headers: jsonHeader,
          },
        );
        // eslint-disable-next-line no-empty
      } catch (e) {}

      return getHistoryAdapter(accountHistoryResponse?.data);
    },
    async () => {
      if (customHost) {
        let accountHistoryResponse: any;

        try {
          accountHistoryResponse = await axios.get(
            `${customHost}${APIRemoteRoute.Txs}${APIRemoteRoute.Search}`,
            {
              params: {
                search: accountName,
                limit: 10,
                offset: 0,
              },
              headers: jsonHeader,
            },
          );
          // eslint-disable-next-line no-empty
        } catch (e) {}

        return getHistoryAdapter(accountHistoryResponse?.data);
      }
      return null;
    },
  );
}
