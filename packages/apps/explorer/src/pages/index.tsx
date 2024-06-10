import {
  useLastBlockHeightQuery,
  useNewBlocksSubscription,
} from '@/__generated__/sdk';
import SearchLayout from '@/components/layout/search-layout/search-layout';
import SearchComponent from '@/components/search-component/search-component';
import { getSearchData } from '@/constants/search';
import { IChainBlock, addBlockData } from '@/services/block';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
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

  const searchData = getSearchData();

  return (
    <SearchLayout>
      <Stack
        className={atoms({ flexDirection: 'column' })}
        gap={'xxl'}
        alignItems={'center'}
      >
        <LogoKdacolorLight />
        <SearchComponent {...searchData} />
      </Stack>
    </SearchLayout>
  );
};

export default Home;
