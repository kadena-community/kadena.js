import useSWR, { SWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import range from 'lodash/range';

import { APIRemoteRoute, APIRoute } from '../config/Routes';
import {
  getAllInfoByTime,
  getCoinInformation,
  getInfo,
  NodeInfoResponseData,
} from '../network/info';
import {
  BlockDetail,
  getNetworkConfig,
  NetworkName,
  NodeHash,
  TimeInterval,
  TransactionDetail,
} from '../utils/api';
import { ChainInfoResponseData, getChainInfo } from '../network/chain';
import { getRecentInfo, RecentResponseData } from '../network/recent';
import {
  ApiSearchType,
  getSearchInfo,
  SearchResultResponseData,
  SearchType,
} from '../network/search';
import { ChainStatsResponseData, getStatInfo } from '../network/stats';
import { getTransactionInfo } from '../network/transaction';
import { getBlockInfo } from '../network/block';
import { getBlockOutputs, OutputResponseData } from '../network/outputs';
import { hasWindow } from 'utils/hasWindow';
import { useDebounce } from 'utils/hooks';
import { getBranchInfo } from '../network/branch';
import { BlocksContext } from './app';

interface IProps {
  fallbackApiData?: any;
}

export function withFallbackApiData<P extends IProps>(
  WrappedComponent: React.FC<P>,
) {
  return (props: P) => {
    return (
      <SWRConfig value={{ fallback: props.fallbackApiData }}>
        <WrappedComponent {...props} />
      </SWRConfig>
    );
  };
}

export const nodeInfoAsync = async (url: string, network: NetworkName) => {
  return getInfo({ network });
};

export const useNodeInfo = (network: NetworkName) => {
  const { data: infoData } = useSWR<NodeInfoResponseData | null>(
    [APIRoute.Info, network],
    nodeInfoAsync,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      errorRetryCount: 1,
    },
  );
  return infoData;
};

export const useRecentUpdates = (
  network: NetworkName,
  nodeInfo?: {
    version?: string;
    instance?: string;
    chainIds?: string[];
    height?: number;
  } | null,
  onNewBlock?: (block: BlockDetail, original?: any) => void | Promise<void>,
) => {
  const prevInfo = useRef<any>(null);
  useEffect(() => {
    if (nodeInfo && !isEqual(nodeInfo, prevInfo.current)) {
      const blockAdapter = (apiEventData: any) => {
        const { adjacents, chainwebVersion, ...restData } = apiEventData;
        return {
          ...restData,
          neighbours: adjacents,
          chainVersion: chainwebVersion,
        } as BlockDetail;
      };
      const eventSource = new EventSource(
        `${getNetworkConfig(network)}${APIRemoteRoute.ChainWeb}/${
          nodeInfo.version
        }/${nodeInfo.instance}${APIRemoteRoute.BlockHeader}${
          APIRemoteRoute.Updates
        }`,
      );
      eventSource.addEventListener('BlockHeader', (e) => {
        try {
          const eventJson = JSON.parse(e.data);
          const block = blockAdapter({
            ...eventJson.header,
            txCount: eventJson.txCount,
          });
          if (onNewBlock) {
            onNewBlock(block, eventJson.header);
          }
          // eslint-disable-next-line no-empty
        } catch (error) {}
      });
      eventSource.onerror = () => {
        eventSource.close();
      };
      return () => {
        eventSource.close();
      };
    }
    prevInfo.current = nodeInfo;
  }, [nodeInfo, onNewBlock]);
};

export const statInfoAsync = async (url: string, network: NetworkName) => {
  return getStatInfo({
    network,
  });
};

export const chainInfoAsync = async (
  url: string,
  network: NetworkName,
  params: {
    version: string;
    instance: string;
    chainIds: string[];
    height: number;
  },
  block?: BlockDetail,
) => {
  return getChainInfo({
    network,
    block,
    version: params.version,
    instance: params.instance,
    chainIds: params.chainIds,
    height: params.height,
  });
};

export const useChainInfo = (
  network: NetworkName,
  params?: {
    version?: string;
    instance?: string;
    chainIds?: string[];
    height?: number;
  } | null,
) => {
  const { blocks } = useContext(BlocksContext);
  const newBlock = blocks.length ? blocks[0] : undefined;

  const { data: chainData } = useSWR<ChainInfoResponseData | null>(
    () =>
      params?.version && params?.instance && params?.chainIds && params?.height
        ? [APIRoute.Chain, network, params, newBlock]
        : undefined,
    chainInfoAsync,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      errorRetryCount: 1,
    },
  );

  const { data: statData } = useSWR<ChainStatsResponseData | null>(
    [APIRoute.Stats, network],
    statInfoAsync,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 5000,
      errorRetryCount: 1,
    },
  );

  if (chainData && statData) {
    return {
      ...chainData,
      ...statData,
    };
  }
  return null;
};

export const allInfoByTimeAsync = async (
  network: NetworkName,
  time: TimeInterval,
) => {
  return getAllInfoByTime({
    network,
    time,
  });
};

export const useAllInfoByTime = (
  network: NetworkName,
  params?: {
    time?: string;
  } | null,
) => {
  const { data } = useSWR<any>(
    () => [network, params?.time],
    allInfoByTimeAsync,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 60 * 60 * 1000,
      errorRetryCount: 1,
    },
  );

  return { data: data || [], isLoading: !!data };
};

export const recentInfoAsync = async (url: string, network: NetworkName) => {
  return getRecentInfo({
    network,
  });
};

export const useRecentInfo = (network: NetworkName) => {
  const { data: recentTransactionData } = useSWR<RecentResponseData | null>(
    [APIRoute.Recent, network],
    recentInfoAsync,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 5000,
      errorRetryCount: 1,
    },
  );

  const { blocks } = useContext(BlocksContext);
  const recentBlocks = blocks.slice(0, 20);

  const recentTransactions = useMemo(
    () => (recentTransactionData?.transactions || []).slice(0, 20),
    [recentTransactionData],
  );

  return {
    recentBlocks,
    recentTransactions,
  };
};

export const searchInfoAsync = async (
  url: string,
  network: NetworkName,
  params: {
    version: string;
    instance: string;
    chainIds: string[];
    query: number;
  },
  type?: SearchType,
) => {
  if (!hasWindow) {
    return null;
  }
  return getSearchInfo({
    network,
    version: params.version,
    instance: params.instance,
    chainIds: params.chainIds,
    query: params.query,
    type,
  });
};

export const useSearchInfo = (
  network: NetworkName,
  searchType: SearchType,
  params?: {
    version: string;
    instance: string;
    query: string;
    chainIds: string[];
  },
) => {
  const args = {
    version: params?.version,
    instance: params?.instance,
    query: params?.query,
    chainIds: params?.chainIds,
  };
  const options = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
    errorRetryCount: 0,
  };

  const type = useMemo<ApiSearchType>(() => {
    if (['xYield', 'swap'].includes(searchType)) {
      return 'accountHistory';
    }
    return searchType as ApiSearchType;
  }, [searchType]);

  const { data, isValidating: isLoading } =
    useSWRImmutable<SearchResultResponseData | null>(
      () =>
        params?.version &&
        params?.instance &&
        params?.query &&
        params?.chainIds &&
        ((params?.query.length >= 40 && type === 'requestKey') ||
          type !== 'requestKey') &&
        ((params?.query.length >= 60 && type === 'accountHistory') ||
          type !== 'accountHistory')
          ? [APIRoute.Search, network, args, type]
          : undefined,
      searchInfoAsync,
      options,
    );

  const keys = {
    requestKey: 'requestKeys',
    event: 'events',
    transaction: 'transactions',
    accountHistory: 'accountHistory',
  };

  return {
    isLoading,
    data: data ? data[keys[type] as keyof SearchResultResponseData] : [],
  };
};

export const transactionInfoAsync = async (
  url: string,
  network: NetworkName,
  requestKey: string,
) => {
  if (!requestKey) {
    return null;
  }
  return getTransactionInfo({
    network,
    requestKey,
  });
};

export const useTransactionInfo = (
  network: NetworkName,
  requestKey: string,
) => {
  const { data: transactionData, error } = useSWR<TransactionDetail | null>(
    [APIRoute.Transaction, network, requestKey],
    transactionInfoAsync,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      errorRetryCount: 3,
    },
  );
  const errorDebounce = useDebounce(error, 2000);
  return { transactionData: transactionData || null, error: errorDebounce };
};

export const blockInfoAsync = async (
  url: string,
  network: NetworkName,
  params: {
    version: string;
    instance: string;
    chainId: string;
    hash: string;
  },
) => {
  const blockInfo = await getBlockInfo({
    network,
    version: params.version,
    instance: params.instance,
    chainId: params.chainId,
    hash: params.hash,
  });

  let blockOutputs: any = null;
  if (blockInfo?.payloadHash) {
    try {
      blockOutputs = await getBlockOutputs({
        network,
        payload: blockInfo.payloadHash,
        version: params.version,
        instance: params.instance,
        chainId: params.chainId,
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return {
    blockHeader: blockInfo || null,
    blockPayload: blockOutputs || null,
  };
};

export const branchInfoAsync = async (
  url: string,
  network: NetworkName,
  params: {
    version: string;
    instance: string;
    chainId: string;
    height: string;
    hashes: NodeHash[];
  },
) => {
  const branchInfo = await getBranchInfo({
    network,
    version: params.version,
    instance: params.instance,
    chainId: params.chainId,
    lowerHashes: [],
    upperHashes: [params.hashes[Number(params.chainId)].hash],
    maxHeight: params.height,
    minHeight: params.height,
  });

  let blockInfo: BlockDetail | undefined = undefined;
  if ((branchInfo || []).length > 0) {
    blockInfo = branchInfo?.[0];
  }

  let blockOutputs: any = null;
  if (blockInfo?.payloadHash) {
    try {
      blockOutputs = await getBlockOutputs({
        network,
        payload: blockInfo?.payloadHash,
        version: params.version,
        instance: params.instance,
        chainId: params.chainId,
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return {
    blockHeader: blockInfo || null,
    blockPayload: blockOutputs || null,
  };
};

export const useBlockInfo = (
  network: NetworkName,
  params?: {
    version: string;
    instance: string;
    chainId: string;
    hash?: string;
    height?: string;
    hashes?: NodeHash[];
  },
) => {
  const { data: blockByHashResponseData, error: byHashError } = useSWR<{
    blockHeader: BlockDetail | null;
    blockPayload: OutputResponseData | null;
  } | null>(
    () =>
      params?.version &&
      params?.instance &&
      params?.chainId !== undefined &&
      params?.hash
        ? [APIRoute.Block, network, params]
        : undefined,
    blockInfoAsync,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      errorRetryCount: 1,
    },
  );

  const { data: blockByHeightResponseData, error: byHeightError } = useSWR<{
    blockHeader: BlockDetail | null;
    blockPayload: OutputResponseData | null;
  } | null>(
    () =>
      params?.version &&
      params?.instance &&
      params?.chainId !== undefined &&
      params?.height &&
      (params?.hashes || []).length > 0
        ? [APIRoute.Block, network, params]
        : undefined,
    branchInfoAsync,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      errorRetryCount: 1,
    },
  );

  const errorMemoized = useMemo(
    () => byHashError || byHeightError,
    [byHashError, byHeightError],
  );
  const error = useDebounce(errorMemoized, 2000);

  return {
    blockResponseData:
      blockByHashResponseData || blockByHeightResponseData || null,
    error,
  };
};

export const coinInformationAsync = async () => {
  return getCoinInformation();
};

export const useCoinInformation = (network: NetworkName) => {
  const { data } = useSWR<any>(() => [network], coinInformationAsync, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 60 * 1000,
    errorRetryCount: 1,
  });

  return { data };
};

const getInitNodes = () => {
  const nodes: Record<string, string | number>[] = [];
  range(4).forEach((i) => {
    range(20).forEach((j) => {
      nodes.push({
        id: `${i}_${j}`,
        chainId: j,
        level: i,
      });
    });
  });
  return nodes;
};

export const getTime = (creationTime: number) => {
  const now = Date.now();
  return Math.round((now - Math.round(creationTime / 1000)) / 1000);
};

export const useChainGraph = (
  ySize: number,
  ySizeDelta: number,
  xSize: number,
  xSizeDelta: number,
) => {
  const memoGetInitNodes = useCallback(getInitNodes, []);
  const memoGetTime = useCallback(getTime, []);
  const initNodes = memoGetInitNodes();

  const { blocks } = useContext(BlocksContext);

  const graphData = useMemo(() => {
    const heights = uniq(map(blocks, 'height'))
      .sort((a, b) => b - a)
      .slice(0, 4);

    const objHeights: Record<string, string> = heights.reduce(
      (obj, item, index) => ({ [item]: index, ...obj }),
      {},
    );

    const data = blocks
      .filter((item) => heights.includes(item.height))
      .map((item) => ({
        ...item,
        level: objHeights[item.height],
      }));

    const dataObj: Record<
      string,
      Record<string, string | number>
    > = data.reduce(
      (obj, item) => ({
        [`${item.level}_${item.chainId}`]: item,
        ...obj,
      }),
      {},
    );

    const nodes = initNodes.map((item) => {
      if (dataObj[item.id]) {
        return {
          id: dataObj[item.id].hash,
          height: dataObj[item.id].height,
          chainId: dataObj[item.id].chainId,
          neighbours: dataObj[item.id].neighbours,
          level: dataObj[item.id].level,
          creationTime: dataObj[item.id].creationTime,
          time: memoGetTime(Number(dataObj[item.id].creationTime)),
          txs: dataObj[item.id].txCount,
        };
      }
      if (item.level === 0 && item.chainId === 0) {
        return {
          ...item,
          height: heights.length ? heights[0] : undefined,
        };
      }
      return item;
    });

    const links: { source: any; target: any }[] = [];
    data.forEach((element) => {
      const values = Object.values(element?.neighbours);
      values.forEach((item) => {
        const child = data.find((a) => a.hash === item);
        if (child && Number(element?.level) < 3) {
          const parentX = Number(element.chainId) * xSize - xSizeDelta;
          const parentY = Number(element.level) * ySize - ySizeDelta;
          const childX = Number(child.chainId) * xSize - xSizeDelta;
          const childY = Number(child.level) * ySize - ySizeDelta;
          links.push({
            source: {
              id: element.hash,
              y: parentY,
              fy: parentY,
              x: parentX,
              fx: parentX,
            },
            target: { id: item, y: childY, fy: childY, x: childX, fx: childX },
          });
        }
      });
    });

    return { nodes, links };
  }, [blocks]);

  return graphData;
};
