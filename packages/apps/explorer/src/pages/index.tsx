import { useNetworkInfoQuery } from '@/__generated__/sdk';
import Search from '@/components/search/search';
import StatisticsStack from '@/components/statistics-stack/statistics-stack';
import { getSearchData } from '@/constants/search';
import { formatStatisticsData } from '@/services/format';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack } from '@kadena/react-ui';
import React from 'react';

const Home: React.FC = () => {
  const { data: statisticsData } = useNetworkInfoQuery();

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);
  const searchData = getSearchData();

  return (
    <Stack flexDirection={'column'} gap={'xxl'} alignItems={'center'}>
      <StatisticsStack data={statisticsGridData}></StatisticsStack>
      <LogoKdacolorLight />
      <Search {...searchData} />
    </Stack>
  );
};

export default Home;
