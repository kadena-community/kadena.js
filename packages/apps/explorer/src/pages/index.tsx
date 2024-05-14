import type { NetworkInfo } from '@/__generated__/sdk';
import { useNetworkInfoQuery } from '@/__generated__/sdk';
import SearchDropdown from '@/components/search-dropdown/search-dropdown';
import StatisticsStack from '@/components/statistics-stack/statistics-stack';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack } from '@kadena/react-ui';
import React from 'react';

const formatStatisticsData = (
  networkInfo: NetworkInfo | null | undefined,
): { label: string; value: string }[] => {
  if (!networkInfo) {
    return [
      { label: 'Est. Network Hash', value: '0 PH/s' },
      { label: 'Total Difficulty', value: '0 EH' },
      { label: 'Transactions', value: '0' },
      { label: 'Circulating Coins', value: '0' },
    ];
  }

  return [
    {
      label: 'Est. Network Hash',
      value: `${networkInfo.networkHashRate} PH/s`,
    },
    { label: 'Total Difficulty', value: `${networkInfo.totalDifficulty} EH` },
    { label: 'Transactions', value: `${networkInfo.transactionCount}` },
    { label: 'Circulating Coins', value: `${networkInfo.coinsInCirculation}` },
  ];
};

const Home: React.FC = () => {
  const { data: statisticsData } = useNetworkInfoQuery();

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);

  return (
    <Stack flexDirection={'column'} gap={'lg'} alignItems={'center'}>
      <StatisticsStack data={statisticsGridData}></StatisticsStack>
      <LogoKdacolorLight />
      <SearchDropdown />
    </Stack>
  );
};

export default Home;
