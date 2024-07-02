import BlockTable from '@/components/block-table/block-table';
import Layout from '@/components/layout/layout';
import { Media } from '@/components/layout/media';
import Logo from '@/components/logo/logo';
import SearchComponent from '@/components/search/search-component/search-component';
import SearchResults from '@/components/search/search-results/search-results';
import StatisticsGrid from '@/components/statistics-component/statistics-grid/statistics-grid';
import { useSearch } from '@/hooks/search';
import { Stack } from '@kadena/kode-ui';
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
    <Layout>
      <Media greaterThanOrEqual="sm">
        <Stack
          flexDirection="column"
          alignItems={'center'}
          marginBlockStart="md"
        >
          <a href="/">
            <Logo />
          </a>

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
        <StatisticsGrid />
        <Stack
          flexDirection="column"
          alignItems={'center'}
          paddingBlockStart={'xxl'}
        >
          <a href="/">
            <Logo />
          </a>
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
    </Layout>
  );
};

export default Home;
