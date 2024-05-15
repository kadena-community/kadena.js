import type { NetworkInfo } from '@/__generated__/sdk';
import { useNetworkInfoQuery } from '@/__generated__/sdk';
import SearchCombobox from '@/components/search-dropdown/search-combobox';
import StatisticsStack from '@/components/statistics-stack/statistics-stack';
import { formatNumberWithUnit } from '@/services/format';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack, Text } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

const formatStatisticsData = (
  networkInfo: NetworkInfo | null | undefined,
): { label: string; value: string }[] => {
  if (!networkInfo) {
    return [
      { label: 'Est. Network Hash', value: '0 H/s' },
      { label: 'Total Difficulty', value: '0  H' },
      { label: 'Transactions', value: '0' },
      { label: 'Circulating Coins', value: '0' },
    ];
  }

  return [
    {
      label: 'Est. Network Hash',
      value: formatNumberWithUnit(networkInfo.networkHashRate, 'H/s'),
    },
    {
      label: 'Total Difficulty',
      value: formatNumberWithUnit(networkInfo.totalDifficulty, 'H'),
    },
    {
      label: 'Transactions',
      value: formatNumberWithUnit(networkInfo.transactionCount),
    },
    {
      label: 'Circulating Coins',
      value: formatNumberWithUnit(networkInfo.coinsInCirculation),
    },
  ];
};

const Home: React.FC = () => {
  const { data: statisticsData } = useNetworkInfoQuery();

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);

  return (
    <Stack flexDirection={'column'} gap={'xxl'} alignItems={'center'}>
      <StatisticsStack data={statisticsGridData}></StatisticsStack>
      <LogoKdacolorLight />
      <SearchCombobox />
    </Stack>
  );
};

export default Home;
