import { Media } from '@/components/layout/media';
import SearchLayout from '@/components/layout/search-layout/search-layout';
import SearchBox from '@/components/search/search';
import SearchResults from '@/components/search/search-results/search-results';
import { useSearch } from '@/hooks/search';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

const Home: React.FC = () => {
  const {
    setSearchQuery,
    searchQuery,
    searchOption,
    setSearchOption,
    data: searchData,
    loading,
    errors,
  } = useSearch();

  return (
    <SearchLayout>
      <Media greaterThanOrEqual="sm">
        <Stack
          className={atoms({ flexDirection: 'column' })}
          gap={'xxl'}
          alignItems={'center'}
        >
          <LogoKdacolorLight />
          <SearchBox
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            searchData={searchData}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            loading={loading}
            errors={errors}
          />
          {searchData && (
            <SearchResults
              searchData={searchData}
              loading={loading}
              errors={errors}
            />
          )}
        </Stack>
      </Media>

      <Media lessThan="sm">
        <Stack
          className={atoms({ flexDirection: 'column-reverse' })}
          gap={'xxl'}
          alignItems={'center'}
          paddingBlockStart={'xxl'}
        >
          <LogoKdacolorLight />
          <SearchBox
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            searchData={searchData}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            loading={loading}
            errors={errors}
          />
          {searchData && (
            <SearchResults
              searchData={searchData}
              loading={loading}
              errors={errors}
            />
          )}
        </Stack>
      </Media>
    </SearchLayout>
  );
};

export default Home;
