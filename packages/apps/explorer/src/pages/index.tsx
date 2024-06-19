import BlockTable from '@/components/block-table/block-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import { Media } from '@/components/layout/media';
import SearchLayout from '@/components/layout/search-layout/search-layout';
import SearchComponent from '@/components/search/search-component/search-component';
import SearchResults from '@/components/search/search-results/search-results';
import { useSearch } from '@/hooks/search';
import { LogoKdacolorLight } from '@kadena/react-icons/brand';
import { Stack } from '@kadena/react-ui';
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
      <GraphQLQueryDialog queries={[]} />
      <Media greaterThanOrEqual="sm">
        <Stack flexDirection="column" gap={'xxl'} alignItems={'center'}>
          <LogoKdacolorLight />
          <SearchComponent
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            searchData={searchData}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            loading={loading}
            errors={errors}
          />
          {searchQuery ? (
            searchData && (
              <SearchResults
                searchData={searchData}
                loading={loading}
                errors={errors}
              />
            )
          ) : (
            <BlockTable />
          )}
        </Stack>
      </Media>

      <Media lessThan="sm">
        <Stack
          flexDirection="column"
          gap={'xxl'}
          alignItems={'center'}
          paddingBlockStart={'xxl'}
        >
          <LogoKdacolorLight />
          <SearchComponent
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            searchData={searchData}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            loading={loading}
            errors={errors}
          />
          {searchQuery ? (
            searchData && (
              <SearchResults
                searchData={searchData}
                loading={loading}
                errors={errors}
              />
            )
          ) : (
            <BlockTable />
          )}
        </Stack>
      </Media>
    </SearchLayout>
  );
};

export default Home;
