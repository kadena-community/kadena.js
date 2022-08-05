import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import BannerGraphic from '../components/common/Home/components/Banner/components/BannerBlocks/BannerGraphic/BannerGraphic';
import { ChainInfoResponseData } from '../network/chain';
import { abbreviateNumber, getAbbreviatedNumber } from '../utils/string';
import { ChainStatsResponseData } from '../network/stats';
import { NetworkName, TimeInterval } from '../utils/api';

interface IPropsChart {
  blockChartData: IDataChartBlock[];
}

export interface IBanner {
  id: number;
  title: string;
  value: string | number;
  Component: FC<IPropsChart>;
  domain: number[];
  data: IDataChart[];
}

export interface IDataBtn {
  id: number;
  value: string;
  interval: number;
}

export interface IDataChart {
  name: string;
  uv: number;
  pv: number;
  max?: number;
  min?: number;
}

export interface IDataChartBlock {
  uv: number;
}

interface IChartDataProps {
  network: NetworkName;
  chainInfo?: (ChainInfoResponseData & ChainStatsResponseData) | null;
  allInfo: Record<string, Record<string, string>>[];
  timeInterval: TimeInterval;
}

export const getDataBanners = (
  timeInterval: TimeInterval,
  allInfo: Record<string, Record<string, string>>[],
  totalDifficulties: { value: string; date: string }[],
  hashRates: { value: string; date: string }[],
  transactions: { value: string; date: string }[],
  circulatingSupplies: { value: string; date: string }[],
) => {
  const totalDifficulty: {
    max: number;
    data: IDataChart[];
    value: string;
  } = {
    max: 0,
    data: [],
    value: abbreviateNumber(
      totalDifficulties[totalDifficulties.length - 1].value,
      'H',
    ),
  };

  const hashRate: {
    max: number;
    data: IDataChart[];
    value: string;
  } = {
    max: 0,
    data: [],
    value: abbreviateNumber(hashRates[hashRates.length - 1].value, 'H/S'),
  };

  const transaction: {
    min: number;
    max: number;
    data: IDataChart[];
    value: string;
  } = {
    min: 0,
    max: 0,
    data: [],
    value: transactions[transactions.length - 1].value,
  };

  const circulatingSupply: {
    min: number;
    max: number;
    data: IDataChart[];
    value: string;
  } = {
    min: 0,
    max: 0,
    data: [],
    value: abbreviateNumber(
      circulatingSupplies[circulatingSupplies.length - 1].value,
    ),
  };

  switch (timeInterval) {
    case TimeInterval.REAL_TIME: {
      totalDifficulty.max = getAbbreviatedNumber(
        totalDifficulties[totalDifficulties.length - 1].value,
      );
      totalDifficulty.data = totalDifficulties.map(
        (difficultyHistory, index) => ({
          name: difficultyHistory.date,
          uv: getAbbreviatedNumber(difficultyHistory.value),
          pv: getAbbreviatedNumber(difficultyHistory.value),
          nameIndex: index,
        }),
      );

      hashRate.max = getAbbreviatedNumber(
        hashRates[hashRates.length - 1].value,
      );
      hashRate.data = hashRates.map((hareHistory, index) => ({
        name: hareHistory.date,
        uv: getAbbreviatedNumber(hareHistory.value),
        pv: getAbbreviatedNumber(hareHistory.value),
        nameIndex: index,
      }));

      transaction.min = Number(transaction.value);
      transaction.max = Number(transaction.value);
      transaction.data = transactions.map((transactionHistory, index) => ({
        name: transactionHistory.date,
        uv: Number(transactionHistory.value),
        pv: Number(transactionHistory.value),
        nameIndex: index,
      }));

      circulatingSupply.min = getAbbreviatedNumber(
        circulatingSupplies[circulatingSupplies.length - 1].value,
      );
      circulatingSupply.max = circulatingSupply.min;
      circulatingSupply.data = circulatingSupplies.map(
        (supplyHistory, index) => ({
          name: supplyHistory.date,
          uv: getAbbreviatedNumber(supplyHistory.value),
          pv: getAbbreviatedNumber(supplyHistory.value),
          nameIndex: index,
        }),
      );

      break;
    }
    default: {
      const { totalDifficulty: maxTotalDifficulty } =
        maxBy(allInfo, item => item.totalDifficulty?.avg) || {};
      totalDifficulty.max = getAbbreviatedNumber(maxTotalDifficulty?.avg);
      totalDifficulty.data = allInfo.map((item, index) => ({
        name: item.totalDifficulty?.time,
        uv: getAbbreviatedNumber(item.totalDifficulty?.avg),
        pv: getAbbreviatedNumber(item.totalDifficulty?.avg),
        max: getAbbreviatedNumber(item.totalDifficulty?.max),
        min: getAbbreviatedNumber(item.totalDifficulty?.min),
        nameIndex: index,
      }));

      const { networkHashRate: maxNetworkHashRate } =
        maxBy(allInfo, item => item.networkHashRate?.avg) || {};
      hashRate.max = getAbbreviatedNumber(maxNetworkHashRate?.avg);
      hashRate.data = allInfo.map((item, index) => ({
        name: item.networkHashRate?.time,
        uv: getAbbreviatedNumber(item.networkHashRate?.avg),
        pv: getAbbreviatedNumber(item.networkHashRate?.avg),
        max: getAbbreviatedNumber(item.networkHashRate?.max),
        min: getAbbreviatedNumber(item.networkHashRate?.min),
        nameIndex: index,
      }));

      const { totalTransactions: minTotalTransactions } =
        minBy(allInfo, item => item.totalTransactions?.avg) || {};
      const { totalTransactions: maxTotalTransactions } =
        maxBy(allInfo, item => item.totalTransactions?.avg) || {};
      transaction.min = Number(minTotalTransactions?.avg);
      transaction.max = Number(maxTotalTransactions?.avg);
      transaction.data = allInfo.map((item, index) => ({
        name: item.totalTransactions?.time,
        uv: Number(Number(item.totalTransactions?.avg).toFixed(2)),
        pv: Number(Number(item.totalTransactions?.avg).toFixed(2)),
        max: getAbbreviatedNumber(item.totalTransactions?.max),
        min: getAbbreviatedNumber(item.totalTransactions?.min),
        nameIndex: index,
      }));

      const { circulatingSupply: minCirculatingSupply } =
        minBy(allInfo, item => item.circulatingSupply?.avg) || {};
      const { circulatingSupply: maxCirculatingSupply } =
        maxBy(allInfo, item => item.circulatingSupply?.avg) || {};
      circulatingSupply.min = getAbbreviatedNumber(minCirculatingSupply?.avg);
      circulatingSupply.max = getAbbreviatedNumber(maxCirculatingSupply?.avg);
      circulatingSupply.data = allInfo.map((item, index) => ({
        name: item.circulatingSupply?.time,
        uv: getAbbreviatedNumber(item.circulatingSupply?.avg),
        pv: getAbbreviatedNumber(item.circulatingSupply?.avg),
        max: getAbbreviatedNumber(item.circulatingSupply?.max),
        min: getAbbreviatedNumber(item.circulatingSupply?.min),
        nameIndex: index,
      }));

      break;
    }
  }
  return {
    totalDifficulty,
    hashRate,
    transaction,
    circulatingSupply,
  };
};

export const calculateDomain = (value: number, degree: number) => {
  return Math.ceil(value / degree) * degree;
};

export const useChartData = ({
  network,
  chainInfo,
  allInfo,
  timeInterval,
}: IChartDataProps) => {
  const [active, setActive] = useState<number>(1);

  const onChangeBg = useCallback((current: number, data: IDataChart[]) => {
    setActive(current);
  }, []);

  const [totalDifficulties, setTotalDifficulties] = useState<
    { value: string; date: string }[]
  >([]);
  const [hashRates, setHashRates] = useState<{ value: string; date: string }[]>(
    [],
  );
  const [transactions, setTransactions] = useState<
    { value: string; date: string }[]
  >([]);
  const [circulatingSupplies, setCirculatingSupplies] = useState<
    { value: string; date: string }[]
  >([]);
  const [banners, setBanners] = useState<IBanner[]>([]);

  const prevDifficultyNetwork = useRef<NetworkName>(network);
  const prevHashRateNetwork = useRef<NetworkName>(network);
  const prevTransactionsNetwork = useRef<NetworkName>(network);
  const prevCirculatingNetwork = useRef<NetworkName>(network);

  useEffect(() => {
    if (chainInfo?.totalDifficulty !== undefined) {
      if (prevDifficultyNetwork.current !== network) {
        setTotalDifficulties([
          {
            value: chainInfo?.totalDifficulty,
            date: DateTime.now().toFormat('HH:mm:ss'),
          },
        ]);
        prevDifficultyNetwork.current = network;
      } else {
        setTotalDifficulties(v => {
          const dataItems = [
            ...v,
            {
              value: chainInfo?.totalDifficulty,
              date: DateTime.now().toFormat('HH:mm:ss'),
            },
          ];
          return dataItems.slice(-15);
        });
      }
    }
  }, [chainInfo?.totalDifficulty, network]);

  useEffect(() => {
    if (chainInfo?.networkHashRate !== undefined) {
      if (prevDifficultyNetwork.current !== network) {
        setHashRates([
          {
            value: chainInfo?.networkHashRate,
            date: DateTime.now().toFormat('HH:mm:ss'),
          },
        ]);
        prevHashRateNetwork.current = network;
      } else {
        setHashRates(v => {
          const dataItems = [
            ...v,
            {
              value: chainInfo?.networkHashRate,
              date: DateTime.now().toFormat('HH:mm:ss'),
            },
          ];
          return dataItems.slice(-15);
        });
      }
    }
  }, [chainInfo?.networkHashRate, network]);

  useEffect(() => {
    if (chainInfo?.totalTransactions !== undefined) {
      if (prevDifficultyNetwork.current !== network) {
        setTransactions([
          {
            value: `${chainInfo?.totalTransactions || 0}`,
            date: DateTime.now().toFormat('HH:mm:ss'),
          },
        ]);
        prevTransactionsNetwork.current = network;
      } else {
        setTransactions(v => {
          const dataItems = [
            ...v,
            {
              value: `${chainInfo?.totalTransactions || 0}`,
              date: DateTime.now().toFormat('HH:mm:ss'),
            },
          ];
          return dataItems.slice(-15);
        });
      }
    }
  }, [chainInfo?.totalTransactions, network]);

  useEffect(() => {
    if (chainInfo?.circulatingSupply !== undefined) {
      if (prevDifficultyNetwork.current !== network) {
        setCirculatingSupplies([
          {
            value: `${chainInfo?.circulatingSupply || 0}`,
            date: DateTime.now().toFormat('HH:mm:ss'),
          },
        ]);
        prevCirculatingNetwork.current = network;
      } else {
        setCirculatingSupplies(v => {
          const dataItems = [
            ...v,
            {
              value: `${chainInfo?.circulatingSupply || 0}`,
              date: DateTime.now().toFormat('HH:mm:ss'),
            },
          ];
          return dataItems.slice(-15);
        });
      }
    }
  }, [chainInfo?.circulatingSupply, network]);

  useEffect(() => {
    if (
      totalDifficulties.length > 0 &&
      hashRates.length > 0 &&
      transactions.length > 0 &&
      circulatingSupplies.length > 0
    ) {
      const dataBanners = getDataBanners(
        timeInterval,
        allInfo,
        totalDifficulties,
        hashRates,
        transactions,
        circulatingSupplies,
      );

      setBanners([
        {
          id: 1,
          title: 'Est. Hash Rate',
          value: dataBanners.hashRate.value,
          Component: BannerGraphic,
          domain: [0, calculateDomain(dataBanners.hashRate.max, 20) + 20],
          data: dataBanners.hashRate.data,
        },
        {
          id: 2,
          title: 'Total Difficulty',
          value: dataBanners.totalDifficulty.value,
          Component: BannerGraphic,
          domain: [0, calculateDomain(dataBanners.totalDifficulty.max, 1) + 1],
          data: dataBanners.totalDifficulty.data,
        },
        {
          id: 3,
          title: 'Transactions',
          value: dataBanners.transaction.value,
          Component: BannerGraphic,
          domain: [
            dataBanners.transaction.min - 15,
            dataBanners.transaction.max + 15,
          ],
          data: dataBanners.transaction.data,
        },
        {
          id: 4,
          title: 'Circulating Supply',
          value: dataBanners.circulatingSupply.value,
          domain: [
            calculateDomain(dataBanners.circulatingSupply.min, 1) - 5,
            calculateDomain(dataBanners.circulatingSupply.max, 1) + 5,
          ],
          Component: BannerGraphic,
          data: dataBanners.circulatingSupply.data,
        },
      ]);
    }
  }, [
    totalDifficulties,
    hashRates,
    transactions,
    circulatingSupplies,
    timeInterval,
  ]);

  const chartData = useMemo(
    () => ({
      domain:
        (banners || []).find(item => item.id === active)?.domain || undefined,
      data: (banners || []).find(item => item.id === active)?.data || [],
    }),
    [banners, active],
  );

  return {
    banners,
    chartData,
    onChangeBg,
    active,
  };
};
