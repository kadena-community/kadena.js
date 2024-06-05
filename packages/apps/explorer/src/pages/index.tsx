import {
  useNetworkInfoQuery,
  useNewBlocksSubscription,
} from '@/__generated__/sdk';
import BlockTable from '@/components/block-table/block-table';
import { Media } from '@/components/layout/media';
import SearchComponent from '@/components/search-component/search-component';
import StatisticsComponent from '@/components/statistics-component/statistics-component';
import {
  blockHeightColumnsDesktop,
  headerColumnsDesktop,
  headerColumnsMobile,
} from '@/constants/block-table';
import { getSearchData } from '@/constants/search';
import { formatStatisticsData } from '@/services/format';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Box, Stack } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

const Home: React.FC = () => {
  // Ideally we would pull this data once and then make calcs client-side
  const { data: statisticsData } = useNetworkInfoQuery({
    pollInterval: 5000,
  });

  const { data: newBlocksData } = useNewBlocksSubscription({});

  const statisticsGridData = formatStatisticsData(statisticsData?.networkInfo);
  const searchData = getSearchData();
  return (
    <Stack flexDirection={'column'} gap={'xxl'}>
      <Media greaterThanOrEqual="sm">
        <Stack
          className={atoms({ flexDirection: 'column' })}
          gap={'lg'}
          alignItems={'center'}
        >
          <StatisticsComponent data={statisticsGridData} />
          <LogoKdacolorLight />
          <SearchComponent {...searchData} />
        </Stack>
      </Media>
      <Media lessThan="sm">
        <Stack
          className={atoms({ flexDirection: 'column-reverse' })}
          gap={'lg'}
          alignItems={'center'}
          paddingBlockStart={'xl'}
        >
          <StatisticsComponent data={statisticsGridData} />

          <LogoKdacolorLight />
          <SearchComponent {...searchData} />
        </Stack>
      </Media>
      <Box display={'flex'} justifyContent={'center'}>
        <Media greaterThanOrEqual="sm">
          <BlockTable
            blockHeightColumns={blockHeightColumnsDesktop}
            headerColumns={headerColumnsDesktop}
            blockData={newBlocksData}
          />
        </Media>

        <Media lessThan="sm">
          <BlockTable
            blockHeightColumns={blockHeightColumnsDesktop}
            headerColumns={headerColumnsMobile}
            blockData={newBlocksData}
          />
        </Media>
      </Box>
    </Stack>
  );
};

export default Home;
