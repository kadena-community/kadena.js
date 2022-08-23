import axios from 'axios';
import {
  BlockDetail,
  blockJsonHeader,
  DefaultQueryParams,
  getNetworkHashRate,
  getTotalDifficulty,
  NetworkName,
  queryParamsTypeAdapter,
  switchBetweenConfig,
} from '../utils/api';
import {
  MAIN_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { APIRemoteRoute } from '../config/Routes';
import { wait } from '../utils/async';

interface ChainInfoQueryParams extends DefaultQueryParams {
  height: number;
  minHeight?: number;
  chainIds: string[];
  instance: string;
  version: string;
  block?: BlockDetail;
}

export interface ChainInfoResponseData {
  totalDifficulty: string;
  networkHashRate: string;
}

const getInitialBlocks = (network: NetworkName) => {
  if (typeof sessionStorage !== 'undefined') {
    const savedJsonString = sessionStorage.getItem(`${network}-blocks`);
    if (savedJsonString) {
      try {
        return JSON.parse(savedJsonString);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const setInitialBlocks = (network: NetworkName, blockHeaders: any[]) => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(`${network}-blocks`, JSON.stringify(blockHeaders));
  }
};
export async function getChainInfo(
  query: ChainInfoQueryParams,
): Promise<ChainInfoResponseData | null> {
  const { chainIds, network, height, minHeight, version, instance, block } =
    queryParamsTypeAdapter<ChainInfoQueryParams>(query);
  if (!height || !chainIds || chainIds.length === 0 || !network) {
    return null;
  }
  return switchBetweenConfig(
    network,
    async () => {
      let blockHeaders: any[];
      const savedBlockHeaders = getInitialBlocks(network);
      if (block && savedBlockHeaders) {
        blockHeaders = savedBlockHeaders.map((blockItem: any) => {
          if (Number(blockItem?.chainId) === Number(block.chainId)) {
            const blockItems = [...blockItem.data, block];
            return {
              ...blockItem,
              data: blockItems.slice(-4),
            };
          }
          return blockItem;
        });
      } else {
        blockHeaders = await Promise.all(
          chainIds.map(async (chainId: string) => {
            try {
              await wait(200);
              const blockHeaderResponse = await axios.get(
                `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}`,
                {
                  headers: blockJsonHeader,
                  params: {
                    minheight: Math.max(0, minHeight || height - 4),
                    limit: height,
                  },
                },
              );
              return {
                chainId,
                data: blockHeaderResponse.data?.items || [],
              };
            } catch (e) {
              return {
                chainId,
                data: [],
              };
            }
          }),
        );
      }
      setInitialBlocks(network, blockHeaders);

      const totalDifficulty = getTotalDifficulty(blockHeaders);
      const networkHashRate = getNetworkHashRate(blockHeaders, totalDifficulty);

      return {
        totalDifficulty,
        networkHashRate,
      };
    },
    async () => {
      let blockHeaders: any[];
      const savedBlockHeaders = getInitialBlocks(network);
      if (block && savedBlockHeaders) {
        blockHeaders = savedBlockHeaders.map((blockItem: any) => {
          if (Number(blockItem?.chainId) === Number(block.chainId)) {
            const blockItems = [...blockItem.data, block];
            return {
              ...blockItem,
              data: blockItems.slice(-4),
            };
          }
          return blockItem;
        });
      } else {
        blockHeaders = await Promise.all(
          chainIds.map(async (chainId: string) => {
            try {
              await wait(200);
              const blockHeaderResponse = await axios.get(
                `${MAIN_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.BlockHeader}`,
                {
                  headers: blockJsonHeader,
                  params: {
                    minheight: Math.max(0, minHeight || height - 4),
                    limit: height,
                  },
                },
              );
              return {
                chainId,
                data: blockHeaderResponse.data?.items || [],
              };
            } catch (e) {
              return {
                chainId,
                data: [],
              };
            }
          }),
        );
      }
      setInitialBlocks(network, blockHeaders);

      const totalDifficulty = getTotalDifficulty(blockHeaders);
      const networkHashRate = getNetworkHashRate(blockHeaders, totalDifficulty);

      return {
        totalDifficulty,
        networkHashRate,
      };
    },
    () => {
      return null;
    },
  );
}
