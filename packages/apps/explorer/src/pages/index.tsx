import { NetworkInfo, useNetworkInfoQuery } from '@/__generated__/sdk';
import StatisticsStack from '@/components/statistics-stack/statistics-stack';
import { Stack } from '@kadena/react-ui';
import React from 'react';

const Home: React.FC = () => {
  const { data: statisticsData, error: statisticsError } =
    useNetworkInfoQuery();

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);

  return (
    <Stack flexDirection={'column'} gap={'lg'} alignItems={'center'}>
      <div>
        <StatisticsStack data={statisticsGridData}></StatisticsStack>
      </div>
      <div>
        <p>K:Explorer</p>
      </div>
    </Stack>
  );
};

export default Home;

const formatStatisticsData = (networkInfo: NetworkInfo | null | undefined) => {
  if (!networkInfo) {
    return [
      { label: 'Est. Network Hash', value: 0 },
      { label: 'Total Difficulty', value: 0 },
      { label: 'Transactions', value: 0 },
      { label: 'Circulating Coins', value: 0 },
    ];
  }

  return [
    { label: 'Est. Network Hash', value: networkInfo.networkHashRate || 0 },
    { label: 'Total Difficulty', value: networkInfo.totalDifficulty || 0 },
    { label: 'Transactions', value: networkInfo.transactionCount || 0 },
    { label: 'Circulating Coins', value: networkInfo.coinsInCirculation || 0 },
  ];
};
