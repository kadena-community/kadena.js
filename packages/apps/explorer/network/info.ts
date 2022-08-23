import axios from 'axios';
import {
  convertJSONToArray,
  defaultHeader,
  DefaultQueryParams,
  getChainIds,
  getMaxHeightFromHashes,
  NetworkName,
  NodeHash,
  NodeInstance,
  queryParamsTypeAdapter,
  switchBetweenConfig,
  TimeQueryParams,
} from '../utils/api';
import {
  COINGECKO_API_URL,
  MAIN_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { APIRemoteRoute, APIRoute } from '../config/Routes';

export interface NodeInfoResponseData {
  hashes: NodeHash[];
  height: number;
  id: string;
  instance: string;
  version: string;
  origin: string | null;
  weight: string;
  chainIds: string[];
}

const apiConfigAdapter = (apiResponseData: any, networkName: NetworkName) => {
  return {
    name: networkName,
    instance: apiResponseData.nodeVersion,
    version: apiResponseData.nodeApiVersion,
    numberOfChains: apiResponseData.nodeNumberOfChains,
    chainIds: apiResponseData.nodeChains || [],
    chainGraphs: apiResponseData.nodeGraphHistory || [],
  } as NodeInstance;
};

const apiInfoAdapter = (
  apiResponseData: any,
  chainIds: string[],
  chainGraphs: any[],
  instance: string,
  version: string,
) => {
  const hashes = convertJSONToArray<NodeHash>(apiResponseData.hashes);
  return {
    ...apiResponseData,
    hashes,
    height: getMaxHeightFromHashes(hashes),
    chainIds: getChainIds(chainIds, chainGraphs, apiResponseData.height),
    instance,
    version,
  } as NodeInfoResponseData;
};

export async function getInfo(
  query: DefaultQueryParams,
): Promise<NodeInfoResponseData | null> {
  const { network } = queryParamsTypeAdapter(query);
  if (!network) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      const testNetConfigResponse = await axios.get(
        `${TEST_NETWORK_API_URL}${APIRemoteRoute.Config}`,
        {
          headers: defaultHeader,
        },
      );
      const { version, instance, chainIds, chainGraphs } = apiConfigAdapter(
        testNetConfigResponse.data,
        NetworkName.TEST_NETWORK,
      );
      const nodeInfoResponse = await axios.get(
        `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.Info}`,
        {
          headers: defaultHeader,
        },
      );
      return apiInfoAdapter(
        nodeInfoResponse.data,
        chainIds,
        chainGraphs,
        instance,
        version,
      );
    },
    async () => {
      const mainNetConfigResponse = await axios.get(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.Config}`,
        {
          headers: defaultHeader,
        },
      );
      const { version, instance, chainIds, chainGraphs } = apiConfigAdapter(
        mainNetConfigResponse.data,
        NetworkName.MAIN_NETWORK,
      );
      const nodeInfoResponse = await axios.get(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.Info}`,
        {
          headers: defaultHeader,
        },
      );
      return apiInfoAdapter(
        nodeInfoResponse.data,
        chainIds,
        chainGraphs,
        instance,
        version,
      );
    },
    () => {
      return null;
    },
  );
}

export async function getAllInfoByTime(
  query: DefaultQueryParams & TimeQueryParams,
): Promise<NodeInfoResponseData | null> {
  const { network } = queryParamsTypeAdapter(query);

  if (!network) {
    return null;
  }

  const params = new URLSearchParams(query as any);
  const { data } = await axios.get(`${APIRoute.Info}/get?${params}`);

  return data?.info;
}

export async function getCoinInformation(): Promise<
  Record<string, number> | undefined
> {
  const { data: btcData } = await axios.get(
    `${COINGECKO_API_URL}${APIRemoteRoute.Price}`,
    { params: { vs_currencies: 'btc', ids: 'kadena' } },
  );

  const { data: marketData } = await axios.get(
    `${COINGECKO_API_URL}${APIRemoteRoute.Markets}`,
    { params: { vs_currency: 'usd', ids: 'kadena' } },
  );

  const data = {
    usd: marketData?.length && marketData[0]?.current_price,
    btc: btcData?.kadena?.btc,
    marketCap: marketData?.length && marketData[0]?.market_cap,
    percentage:
      marketData?.length &&
      Number(marketData[0]?.price_change_percentage_24h.toFixed(2)),
  };

  return data || undefined;
}
