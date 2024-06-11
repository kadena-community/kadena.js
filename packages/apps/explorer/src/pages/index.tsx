import BlockTable from '@/components/block-table/block-table';
import SearchLayout from '@/components/layout/search-layout/search-layout';
import SearchComponent from '@/components/search-component/search-component';
import { getSearchData } from '@/constants/search';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

const Home: React.FC = () => {
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
        <BlockTable />
      </Stack>
    </SearchLayout>
  );
};

export default Home;
