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
  minHeight: string;
  maxHeight: string;
  lowerHashes?: string[];
  upperHashes?: string[];
  instance: string;
  version: string;
  chainId: string;
}

const apiBranchAdapter = (apiResponseData: any, apiResponseBinData: any) => {
  return (apiResponseData?.items || []).map(
    ({ adjacents, chainwebVersion, ...restData }: any, itemIndex: number) => ({
      ...restData,
      neighbours: adjacents,
      chainVersion: chainwebVersion,
      powHash: (apiResponseBinData?.items || [])[itemIndex] || '',
    }),
  ) as BlockDetail[];
};

export async function getBranchInfo(
  queryParams: BlockQueryParams,
): Promise<BlockDetail[] | null> {
  const {
    minHeight,
    maxHeight,
    upperHashes,
    lowerHashes,
    network,
    instance,
    version,
    chainId,
  } = queryParamsTypeAdapter<BlockQueryParams>(queryParams);
  if (
    minHeight === undefined ||
    maxHeight === undefined ||
    chainId === undefined ||
    !network ||
    !instance ||
    !version
  ) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      const testNetBinResponse = await axios.post(
        `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}${APIRemoteRoute.Branch}`,
        {
          upper: upperHashes || [],
          lower: lowerHashes || [],
        },
        {
          params: {
            minheight: minHeight,
            maxheight: maxHeight,
          },
          headers: jsonHeader,
        },
      );
      const testNetConfigResponse = await axios.post(
        `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}${APIRemoteRoute.Branch}`,
        {
          upper: upperHashes || [],
          lower: lowerHashes || [],
        },
        {
          params: {
            minheight: minHeight,
            maxheight: maxHeight,
          },
          headers: blockJsonHeader,
        },
      );
      return apiBranchAdapter(
        testNetConfigResponse.data,
        testNetBinResponse.data,
      );
    },
    async () => {
      const mainNetBinResponse = await axios.post(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}${APIRemoteRoute.Branch}`,
        {
          upper: upperHashes || [],
          lower: lowerHashes || [],
        },
        {
          params: {
            minheight: minHeight,
            maxheight: maxHeight,
          },
          headers: jsonHeader,
        },
      );
      const mainNetConfigResponse = await axios.post(
        `${MAIN_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}${APIRemoteRoute.Branch}`,
        {
          upper: upperHashes || [],
          lower: lowerHashes || [],
        },
        {
          params: {
            minheight: minHeight,
            maxheight: maxHeight,
          },
          headers: blockJsonHeader,
        },
      );
      return apiBranchAdapter(
        mainNetConfigResponse.data,
        mainNetBinResponse.data,
      );
    },
    () => {
      return null;
    },
  );
}
