import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import {
  defaultHeader,
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

export type SearchType =
  | 'requestKey'
  | 'event'
  | 'transaction'
  | 'accountHistory'
  | 'xYield'
  | 'swap';

export type ApiSearchType = Exclude<SearchType, 'xYield' | 'swap'>;
interface SearchQueryParams extends DefaultQueryParams {
  query: number;
  type?: SearchType;
  chainIds?: string[];
  instance: string;
  version: string;
}

export interface SearchResult {
  id: string;
  type: SearchType;
  title: string;
  subTitle: string;
  time?: string;
  success?: boolean;
  restProps: any;
}

export interface SearchResultResponseData {
  requestKeys: SearchResult[];
  events: SearchResult[];
  transactions: SearchResult[];
  accountHistory: SearchResult[];
}

const getTransactionSearchAdapter = (apiResponseData?: any[]) => {
  return (apiResponseData || []).map(
    ({ requestKey, code, creationTime, ...restProps }: any) => ({
      id: requestKey,
      type: 'transaction',
      title: requestKey,
      subTitle: code,
      time: creationTime,
      success: restProps?.result === TransactionStatus.Success,
      restProps,
    }),
  ) as SearchResult[];
};

const getEventSearchAdapter = (apiResponseData?: any[]) => {
  return (apiResponseData || []).map(
    ({ name, blockTime, params, ...restProps }: any) => ({
      id: JSON.stringify({ name, blockTime, params, ...restProps }),
      type: 'event',
      title: `${name} (Chain: ${restProps.chain}, Height: ${restProps.height})`,
      subTitle: '',
      time: blockTime,
      restProps,
    }),
  ) as SearchResult[];
};

const getPollSearchAdapter = (apiResponseData?: any) => {
  const requestKeys = Object.keys(apiResponseData || {});
  return (requestKeys || [])
    .filter(item => !!apiResponseData[item])
    .map((requestKey: string) => {
      const requestObject = apiResponseData[requestKey];
      const requestObjectKey = Object.keys(requestObject)[0];
      return {
        id: `requestKey-${requestObjectKey}`,
        type: 'requestKey',
        title: requestObjectKey,
        subTitle: '',
        time: '',
        restProps: requestObject[requestObjectKey],
      };
    }) as SearchResult[];
};

const getAccountHistoryAdapter = (apiResponseData?: any[]) => {
  const accountData = [
    ...(apiResponseData || []).map(
      ({ requestKey, code, creationTime, ...restProps }: any) => ({
        id: requestKey,
        type: 'accountHistory',
        title: requestKey,
        subTitle: code,
        time: creationTime,
        success: restProps?.result === TransactionStatus.Success,
        restProps,
      }),
    ),
  ] as SearchResult[];
  if (accountData.length > 0) {
    accountData.unshift({
      id: 'check-balance',
      type: 'accountHistory',
      title: 'Check Balance',
      subTitle: '',
      time: '',
    } as SearchResult);
  }
  return accountData;
};

export async function getSearchInfo(
  queryParams: SearchQueryParams,
): Promise<SearchResultResponseData | null> {
  const { network, query, type, chainIds, version, instance } =
    queryParamsTypeAdapter<SearchQueryParams>(queryParams);
  if (!query || !network) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      let testNetTransactionsResponse: any;
      let testNetEventsResponse: any;
      let requestKeysResponse: any;
      let accountHistoryResponse: any;

      if (!type || type === 'transaction') {
        try {
          testNetTransactionsResponse = await axios.get(
            `${TEST_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Search}`,
            {
              params: {
                search: query,
                limit: 5,
                offset: 0,
              },
              headers: defaultHeader,
            },
          );
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      if (!type || type === 'event') {
        try {
          testNetEventsResponse = await axios.get(
            `${TEST_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Events}`,
            {
              params: {
                search: query,
                limit: 5,
                offset: 0,
              },
              headers: defaultHeader,
            },
          );
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      if ((!type || type === 'requestKey') && (chainIds || []).length > 0) {
        requestKeysResponse = await Promise.all(
          (chainIds || []).map(async (chainId: string) => {
            try {
              const requestKeyResponse = await axios.post(
                `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.PactApi}${APIRemoteRoute.Poll}`,
                {
                  requestKeys: [query],
                },
                {
                  headers: jsonHeader,
                },
              );
              if (!isEmpty(requestKeyResponse.data)) {
                return requestKeyResponse.data;
              }
              return null;
            } catch (e) {
              return null;
            }
          }),
        );
      }
      if (!type || type === 'accountHistory') {
        try {
          accountHistoryResponse = await axios.get(
            `${TEST_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Search}`,
            {
              params: {
                search: query,
                limit: 10,
                offset: 0,
              },
              headers: jsonHeader,
            },
          );
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }

      const requestKeys = getPollSearchAdapter(requestKeysResponse);
      const transactions = getTransactionSearchAdapter(
        testNetTransactionsResponse?.data,
      );
      const events = getEventSearchAdapter(testNetEventsResponse?.data);
      const accountHistory = getAccountHistoryAdapter(
        accountHistoryResponse?.data,
      );

      return {
        requestKeys,
        transactions,
        events,
        accountHistory,
      };
    },
    async () => {
      let mainNetTransactionsResponse: any;
      let mainNetEventsResponse: any;
      let requestKeysResponse: any;
      let accountHistoryResponse: any;

      if (!type || type === 'transaction') {
        try {
          mainNetTransactionsResponse = await axios.get(
            `${MAIN_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Search}`,
            {
              params: {
                search: query,
                limit: 5,
                offset: 0,
              },
              headers: defaultHeader,
            },
          );
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      if (!type || type === 'event') {
        try {
          mainNetEventsResponse = await axios.get(
            `${MAIN_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Events}`,
            {
              params: {
                search: query,
                limit: 5,
                offset: 0,
              },
              headers: defaultHeader,
            },
          );
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      if ((!type || type === 'requestKey') && (chainIds || []).length > 0) {
        requestKeysResponse = await Promise.all(
          (chainIds || []).map(async (chainId: string) => {
            try {
              const requestKeyResponse = await axios.post(
                `${MAIN_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.PactApi}${APIRemoteRoute.Poll}`,
                {
                  requestKeys: [query],
                },
                {
                  headers: jsonHeader,
                },
              );
              if (!isEmpty(requestKeyResponse.data)) {
                return requestKeyResponse.data;
              }
              return null;
            } catch (e) {
              return null;
            }
          }),
        );
      }
      if (!type || type === 'accountHistory') {
        try {
          accountHistoryResponse = await axios.get(
            `${MAIN_NETWORK_API_URL}${APIRemoteRoute.Txs}${APIRemoteRoute.Search}`,
            {
              params: {
                search: query,
                limit: 10,
                offset: 0,
              },
              headers: jsonHeader,
            },
          );
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }

      const requestKeys = getPollSearchAdapter(requestKeysResponse);
      const transactions = getTransactionSearchAdapter(
        mainNetTransactionsResponse?.data,
      );
      const events = getEventSearchAdapter(mainNetEventsResponse?.data);
      const accountHistory = getAccountHistoryAdapter(
        accountHistoryResponse?.data,
      );

      return {
        requestKeys,
        transactions,
        events,
        accountHistory,
      };
    },
    () => {
      return null;
    },
  );
}
