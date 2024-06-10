import {
  useLastBlockHeightQuery,
  useNetworkInfoQuery,
  useNewBlocksSubscription,
} from '@/__generated__/sdk';
import BlockTable from '@/components/block-table/block-table';
import { Media } from '@/components/layout/media';
import SearchComponent from '@/components/search-component/search-component';
import StatisticsComponent from '@/components/statistics-component/statistics-component';
import {
  headerColumnsDesktop,
  headerColumnsMobile,
  lastColumnDesktop,
} from '@/constants/block-table';
import { getSearchData } from '@/constants/search';
import type { IChainBlock } from '@/services/block';
import { addBlockData } from '@/services/block';
import { formatStatisticsData } from '@/services/format';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Box, Stack } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  // Ideally we would pull this data once and then make calcs client-side
  const { data: statisticsData } = useNetworkInfoQuery({
    pollInterval: 5000,
  });

  const { data: newBlocksData } = useNewBlocksSubscription();
  const { data: lastBlockHeight } = useLastBlockHeightQuery();

  const [blockData, setBlockData] = useState<IChainBlock>({});
  const [blockHeights, updateBlockHeights] = useState<number[]>([4, 3, 2, 1]);

  useEffect(() => {
    if (lastBlockHeight?.lastBlockHeight) {
      const newBlockHeights = Array.from(
        { length: 4 },
        (_, i) => lastBlockHeight.lastBlockHeight - i,
      );
      updateBlockHeights(newBlockHeights);
    }
  }, [lastBlockHeight]);

  useEffect(() => {
    if (newBlocksData) {
      const updatedBlockData = addBlockData(blockData, newBlocksData);
      setBlockData(updatedBlockData);

      if (!newBlocksData.newBlocks) return;

      const newMaxHeight = Math.max(
        ...newBlocksData.newBlocks.map((block) => block.height),
      );

      if (newMaxHeight > blockHeights[0]) {
        const newBlockHeights = Array.from(
          { length: 4 },
          (_, i) => newMaxHeight - i,
        );

        updateBlockHeights(newBlockHeights);
      }
    }
  }, [newBlocksData]);

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
            blockHeightColumns={blockHeights}
            headerColumns={headerColumnsDesktop}
            blockData={blockData}
            headerLastColumn={lastColumnDesktop}
          />
        </Media>

        <Media lessThan="sm">
          <BlockTable
            blockHeightColumns={blockHeights}
            headerColumns={headerColumnsMobile}
            blockData={blockData}
          />
        </Media>
      </Box>
    </Stack>
  );
};

export default Home;
