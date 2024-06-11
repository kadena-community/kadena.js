import SearchLayout from '@/components/layout/search-layout/search-layout';
import Search from '@/components/search/search';
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
        <Search {...searchData} />
      </Stack>
    </SearchLayout>
  );
};

export default Home;
