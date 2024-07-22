import { BlockInfoProvider } from '@/components/BlockTable/BlockInfoContext/BlockInfoContext';
import { BlockTable } from '@/components/BlockTable/BlockTable';
import { fullWidthClass } from '@/components/globalstyles.css';
import { Layout } from '@/components/Layout_rename/Layout_rename';
import { Media } from '@/components/Layout_rename/media';
import { Logo } from '@/components/Logo_rename/Logo_rename';
import { SearchComponent } from '@/components/Search/SearchComponent/SearchComponent';
import { searchBarClass } from '@/components/Search/SearchComponent/searchComponent.css';
import { SearchResults } from '@/components/Search/SearchResults/SearchResults';
import { StatisticsGrid } from '@/components/StatisticsComponent/StatisticsGrid/StatisticsGrid';
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
            marginBlockEnd="xxxl"
          >
            <Link href="/">
              <Logo />
            </Link>
          </Stack>
        </Media>

        <Stack ref={inViewRef}></Stack>
        <Media lessThan="md" className={fullWidthClass}>
          <Stack width="100%" marginBlock="xxxl">
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
