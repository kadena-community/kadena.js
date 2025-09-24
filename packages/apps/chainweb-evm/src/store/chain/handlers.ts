import { AppAction, AppStore } from '../app';
import { AccumulatedGraphChartData, ActionType, ChainUpdate, ChartMetaData, GraphChartData, ServiceId } from './type';
import { getMaxNumberStatsDataList } from '../../utils/number';

const entity = 'chain';

export const storeChainHandlers = (getState: () => AppStore, dispatch: (action: AppAction) => void) => ({
  loadChainData: () => {
    return dispatch({ entity, type: ActionType.LOAD_CHAIN_DATA });
  },
  setChainData: (chainUpdate: ChainUpdate) => {
    return dispatch({ entity, type: ActionType.SET_CHAIN_DATA, payload: chainUpdate });
  },
  resetChainsData: () => {
    return dispatch({ entity, type: ActionType.RESET_CHAINS_DATA });
  },
  resetChainData: (chainId: number) => {
    return dispatch({ entity, type: ActionType.RESET_CHAIN_DATA, payload: { chainId } });
  },
  reloadChains: () => {}, // to be set in useData hook

  getChainData: (chainId: number) => {
    return getState().chains.find(c => c.id === chainId);
  },
  getAllTransactionsCount: () => {
    return getState().chains.reduce((acc, chain) => acc + (chain.stats?.transactions?.totalTxns.value ?? 0), 0);
  },
  getAllBlocksCount: () => {
    return getState().chains.reduce((acc, chain) => acc + (chain.stats?.blocks?.totalBlocks.value ?? 0), 0);
  },
  getAllAddressesCount: () => {
    return getState().chains.reduce((acc, chain) => acc + (chain.stats?.addresses?.totalAddresses.value ?? 0), 0);
  },
  getAllChainsCount: () => {
    return getState().chains.length;
  },
  getAllActiveChainsCount: () => {
    return getState().chains.filter(chain => chain.metaData.status === 'online').length;
  },
  getChainTransactionsPercentage: (chainId: number) => {
    const chain = getState().chains.find(c => c.id === chainId);

    if (!chain) return 0;

    const totalTransactions = getState().chains.reduce((acc, c) => acc + (c.stats?.transactions?.totalTxns.value ?? 0), 0);

    if (totalTransactions === 0) return 0;

    return ((chain.stats?.transactions?.totalTxns.value ?? 0) / totalTransactions) * 100;
  },
  getChainAddressesPercentage: (chainId: number) => {
    const chain = getState().chains.find(c => c.id === chainId);

    if (!chain) return 0;

    const totalAddresses = getState().chains.reduce((acc, c) => acc + (c.stats?.addresses?.totalAddresses.value ?? 0), 0);

    if (totalAddresses === 0) return 0;

    return ((chain.stats?.addresses?.totalAddresses.value ?? 0) / totalAddresses) * 100;
  },
  getChainBlocksPercentage: (chainId: number) => {
    const chain = getState().chains.find(c => c.id === chainId);

    if (!chain) return 0;

    const totalBlocks = getState().chains.reduce((acc, c) => acc + (c.stats?.blocks?.totalBlocks.value ?? 0), 0);

    if (totalBlocks === 0) return 0;

    return ((chain.stats?.blocks?.totalBlocks.value ?? 0) / totalBlocks) * 100;
  },
  getChainGasUsedPercentage: (chainId: number) => {
    const chain = getState().chains.find(c => c.id === chainId);

    if (!chain) return 0;

    const maxGasUsedChainValue = getMaxNumberStatsDataList(chain.graphs?.gasUsedGrowth.chart);

    if (maxGasUsedChainValue === 0) return 0;

    const totalGasUsed = getState().chains
      .reduce((acc, chain) => acc + getMaxNumberStatsDataList(chain.graphs?.gasUsedGrowth.chart), 0);

    if (totalGasUsed === 0) return 0;

    return (maxGasUsedChainValue / totalGasUsed) * 100;
  },
  getChainAverageBlockTimePercentage: (chainId: number) => {
    const chain = getState().chains.find(c => c.id === chainId);

    if (!chain) return 0;

    const chainTimes = getState().chains
      .map(c => c.stats?.blocks?.averageBlockTime || {  value: 0, unit: 's' })
      .filter(time => time.value > 0);

    if (chainTimes.length === 0) return 0;

    const minTime = Math.min(...chainTimes.map(time => time.value));
    const maxTime = Math.max(...chainTimes.map(time => time.value));
    const currentTime = chain.stats?.blocks?.averageBlockTime || 0;

    if (currentTime === 0 || minTime === maxTime) return 0;

    return ((maxTime - currentTime.value) / (maxTime - minTime)) * 100;
  },

  // graph data

  getGraphData: (serviceId: ServiceId, chainId: number): GraphChartData[] | [] => {
    const chain = getState().chains.find(c => c.id === chainId);

    if (!chain) return [];

    return chain.graphs?.[serviceId].chart || [];
  },
  getGraphAllDataAccumulatedChains: (serviceId: ServiceId): AccumulatedGraphChartData[] | [] => {
    const chains = getState().chains;

    const dateGroupedData = new Map<string, [string, number, AccumulatedGraphChartData['dataPoints']]>();

    chains.forEach(chain => {
      const chainData = chain.graphs?.[serviceId].chart || [];

      chainData.forEach(dataPoint => {
        if (
          dataPoint.value !== undefined
          && dataPoint.value !== null
          && typeof dataPoint.value === "number"
        ) {
          const dateKey = dataPoint.date;
          const [dateToKey, currentValue, dataPoints] = dateGroupedData.get(dateKey) || [dataPoint.date_to || dateKey, 0, []];

          dateGroupedData.set(dateKey, [
            dateToKey,
            currentValue + dataPoint.value,
            [
              ...dataPoints,
              {
                chainId: chain.id,
                value: dataPoint.value
              }
            ]
          ]);
        }
      });
    });

    return Array.from(dateGroupedData.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .reduce((acc: AccumulatedGraphChartData[], [date, [dateToKey, value, dataPoints]], index) => {
        const accumulatedValue = index === 0
          ? value
          : (Number(acc[index - 1]?.value) || 0) + value
        ;

        acc.push({
          date,
          date_to: dateToKey,
          value: accumulatedValue,
          dataPoints,
        });

        return acc;
      }, []);
  },
  getGraphTitle: (serviceId: ServiceId, property: keyof Pick<ChartMetaData, 'title' | 'description'> = 'title'): string => {
    const chain = getState().chains.find(c => c.graphs?.[serviceId]);

    return chain?.graphs?.[serviceId].info[property] || '';
  }

});
