import axios from 'axios';
import {
  BlockDetail,
  blockJsonHeader,
  DefaultQueryParams,
  jsonHeader,
  queryParamsTypeAdapter,
  switchBetweenConfig,
} from '../utils/api';
import {
  MAIN_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { APIRemoteRoute } from '../config/Routes';

interface BlockQueryParams extends DefaultQueryParams {
  hash: string;
  instance: string;
  version: string;
  chainId: string;
}

const apiBlockAdapter = (apiResponseData: any, apiResponseBinData: any) => {
  const { adjacents, chainwebVersion, ...restData } = apiResponseData;
  return {
    ...restData,
    neighbours: adjacents,
    chainVersion: chainwebVersion,
    powHash: apiResponseBinData || '',
  } as BlockDetail;
};

export async function getBlockInfo(
  query: BlockQueryParams,
): Promise<BlockDetail | null> {
  const { network, hash, instance, version, chainId } =
    queryParamsTypeAdapter<BlockQueryParams>(query);
  if (
    !network ||
    !hash ||
    chainId === undefined ||
    chainId === '' ||
    !instance ||
    !version
  ) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      const testNetConfigResponse = await axios.get(
        `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}/${hash}`,
        {
          params: {
            t: 'json',
          },
          headers: blockJsonHeader,
        },
      );
      const testNetBinResponse = await axios.get(
        `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}/${hash}`,
        {
          params: {
            t: 'bin',
          },
          headers: jsonHeader,
          responseType: 'text',
        },
      );
      return apiBlockAdapter(
        testNetConfigResponse.data,
        testNetBinResponse.data,
      );
    },
    async () => {
      const mainNetConfigResponse = await axios.get(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}/${hash}`,
        {
          params: {
            t: 'json',
          },
          headers: blockJsonHeader,
        },
      );
      const mainNetBinResponse = await axios.get(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}/${hash}`,
        {
          params: {
            t: 'bin',
          },
          headers: jsonHeader,
          responseType: 'text',
        },
      );
      return apiBlockAdapter(
        mainNetConfigResponse.data,
        mainNetBinResponse.data,
      );
    },
    () => {
      return null;
    },
  );
}
