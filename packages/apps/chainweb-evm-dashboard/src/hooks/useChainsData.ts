import useSWR from 'swr';
import { useEffect } from 'react';
import {
  Chain,
  ChainUpdate,
  ChainStatsLinesResponse,
  ResolvedTypes,
  ServiceId,
  CounterStatsResponse
} from '../store/chain/type';
import { storeHandlers, useAppState } from '../store/selectors';
import { chainOptions, fetcher, chainOptions as options } from '../utils';
import { composeEndpoint, enabledServices } from '../utils/chains';
import { ServiceItem, SWRResponseMap } from '../utils/types';

type ServiceID = ServiceId | 'counters';

export const useChainStats = (chainId: number, endpoint: Chain['metaData']['endpoint']) => {
  const uxChainIsLoadingState = useAppState((state) => state.ux?.chains[chainId]?.isLoading) ?? true;
  const uxIsLoading = useAppState((state) => state.ux?.isLoading) ?? true;
  const store = storeHandlers();

  const endpointURLs: Array<ServiceItem<{ id: ServiceID }>> = [
    // { id: 'chainOverallStats' as ServiceId, url: `${composeEndpoint(endpoint.base, chainId)}/api/v2/stats` },
    // { id: 'chainMain' as ServiceId, url: `${composeEndpoint(endpoint.stats, chainId)}/api/v1/pages/main` },
    { id: 'counters' as ServiceId, url: `${composeEndpoint(endpoint.stats, chainId)}/api/v1/counters` },
    ...enabledServices.map(service => ({
      ...service,
      url: `${composeEndpoint(endpoint.stats, chainId)}${service.url}?resolution=DAY`,
    })),
  ]

  let aggregatedData = {} as SWRResponseMap<{ id: ServiceID }>;

  endpointURLs.forEach(service => {
    const {
      data: swrData,
      error: swrError,
      isLoading: swrIsLoading,
      isValidating: swrIsValidating,
      mutate: swrMutate,
    } = useSWR<ResolvedTypes>(
      service.id + `-${chainId}`,
      () => fetcher(service.url),
      options,
    );

    aggregatedData[service.id] = {
      id: service.id,
      type: service.isStatsLine ? 'stats-line' : 'stats-overall',
      data: swrData,
      error: swrError,
      isLoading: swrIsLoading,
      isValidating: swrIsValidating,
      mutate: swrMutate
    };
  });

  const isLoading = Object.values(aggregatedData).filter((item) => item.isLoading).map((item) => item.id);
  const hasErrors = Object.values(aggregatedData).filter((item) => item.error);
  const hasData = Boolean(Object.values(aggregatedData).filter((item) => item.data).length);

  useEffect(() => {
    if (isLoading.length === 0) {
      store.ux.setChainLoading(chainId, !!isLoading.length, hasErrors.length ? (hasErrors[0].error as string) : null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!uxChainIsLoadingState) {
      store.ux.setChainLoading(chainId, true);
    }
  }, []);

  useEffect(() => {
    if (!isLoading.length) {
      const statsData = aggregatedData.counters.data as unknown as CounterStatsResponse;
      const chainUpdate: ChainUpdate = {
        id: chainId,
        metaData: {
          lastUpdated: new Date().toISOString(),
          status: 'online' as const,
        },
        stats: statsData.counters.reduce((acc = {}, counterItem) => {
          acc[counterItem.id] = counterItem;

          return acc;
        }, {} as ChainUpdate['stats']),
        graphs: Object.values(aggregatedData).filter(item => item.type === 'stats-line').reduce((acc, item) => {
          if (item.data) {
            acc[item.id as ServiceId] = item.data as ChainStatsLinesResponse;
          }

          return acc;
        }, {} as { [key in ServiceId]: ChainStatsLinesResponse; }),
      };

      store.chains.setChainData(chainUpdate);
    }
  }, [uxIsLoading]);

  return {
    isLoading: !!isLoading.length,
    isError: !!hasErrors.length,
  };
};

export const useChainsData = (chains: Chain[]) => {
  const chainStats = chains.map(chain =>
    useChainStats(chain.id, chain.metaData.endpoint)
  );
  const isLoading = chainStats.some(stat => stat.isLoading);
  const hasError = chainStats.some(stat => stat.isError);
  // const refreshAll = async () => {
  //   await Promise.all(chainStats.map(async (stat) => {
  //     await stat.refresh.stats();
  //     await stat.refresh.main();
  //     await stat.refresh.accountsGrowthGraph();
  //     await stat.refresh.blocksNewGraph();
  //   }));
  // };

  return {
    isLoading,
    hasError,
  //   refreshAll,
  };
};
