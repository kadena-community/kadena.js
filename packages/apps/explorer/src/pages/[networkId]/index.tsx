import { BlockInfoProvider } from '@/components/block-table/block-info-context/block-info-context';
import BlockTable from '@/components/block-table/block-table';
import { fullWidthClass } from '@/components/globalstyles.css';
import Layout from '@/components/layout/layout';
import { Media } from '@/components/layout/media';
import Logo from '@/components/logo/logo';
import SearchComponent from '@/components/search/search-component/search-component';
import { searchBarClass } from '@/components/search/search-component/search-component.css';
import SearchResults from '@/components/search/search-results/search-results';
import StatisticsGrid from '@/components/statistics-component/statistics-grid/statistics-grid';
import { useSearch } from '@/hooks/search';
import { Stack } from '@kadena/kode-ui';
import Link from 'next/dist/client/link';
import React from 'react';
import { useInView } from 'react-intersection-observer';

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
  const { inView, ref: inViewRef } = useInView();

  return (
    <Layout>
      <BlockInfoProvider>
        <Media greaterThanOrEqual="md">
          <Stack
            flexDirection="column"
            alignItems={'center'}
            marginBlock="xxxl"
          >
            <Link href="/">
              <Logo />
            </Link>
          </Stack>
        </Media>

        <Media lessThan="md" className={fullWidthClass}>
          <Stack ref={inViewRef} width="100%" marginBlock="xxxl">
            <StatisticsGrid inView={inView} />
          </Stack>
        </Media>

        <Stack className={searchBarClass}>
          <SearchComponent
            searchOption={searchOption}
            setSearchOption={setSearchOption}
            searchData={searchData}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            loading={loading}
            errors={errors}
          />
        </Stack>
        <Stack marginBlock="xxxl" />
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
      </BlockInfoProvider>
    </Layout>
  );
};

export default Home;
