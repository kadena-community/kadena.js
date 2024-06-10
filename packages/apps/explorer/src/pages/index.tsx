import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { Media } from '@/components/layout/media';
import SearchBox from '@/components/search/search';
import SearchResults from '@/components/search/search-results/search-results';
import Statistics from '@/components/statistics/statistics';
import { getSearchData } from '@/constants/search';
import { useSearch } from '@/hooks/search';
import { formatStatisticsData } from '@/services/format';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

const Home: React.FC = () => {
  // Ideally we would pull this data once and then make calcs client-side
  const { data: statisticsData } = useNetworkInfoQuery({
    pollInterval: 5000,
  });

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);
  const { setSearchQuery, searchQuery, data: searchData } = useSearch();

  return (
    <>
      <Media greaterThanOrEqual="sm">
        <Stack
          className={atoms({ flexDirection: 'column' })}
          gap={'xxl'}
          alignItems={'center'}
        >
          <Statistics data={statisticsGridData} />
          <LogoKdacolorLight />
          <SearchBox
            {...searchData}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
          {searchData && <SearchResults {...searchData} />}
        </Stack>
      </Media>

      <Media lessThan="sm">
        <Stack
          className={atoms({ flexDirection: 'column-reverse' })}
          gap={'xxl'}
          alignItems={'center'}
          paddingBlockStart={'xxl'}
        >
          <Statistics data={statisticsGridData} />

          <LogoKdacolorLight />
          <SearchBox
            {...searchData}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
          {searchData && <SearchResults {...searchData} />}
        </Stack>
      </Media>
    </>
  );
};

export default Home;
