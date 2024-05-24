import { useNetworkInfoQuery } from '@/__generated__/sdk';
import Search from '@/components/search/search';
import StatisticsGrid from '@/components/statistics/statistics-grid';
import StatisticsStack from '@/components/statistics/statistics-stack';
import { getSearchData } from '@/constants/search';
import { formatStatisticsData } from '@/services/format';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack } from '@kadena/react-ui';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

const Home: React.FC = () => {
  // Ideally we would pull this data once and then make calcs client-side
  const { data: statisticsData } = useNetworkInfoQuery({
    pollInterval: 5000,
  });

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);
  const searchData = getSearchData();

  const isMobile = useMediaQuery({ query: '(max-width: 380px)' });

  return (
    <Stack flexDirection={'column'} gap={'xxl'} alignItems={'center'}>
      {!isMobile && (
        <StatisticsStack data={statisticsGridData}></StatisticsStack>
      )}

      <LogoKdacolorLight />
      <Search {...searchData} />

      {isMobile && <StatisticsGrid data={statisticsGridData}></StatisticsGrid>}
    </Stack>
  );
};

export default Home;
