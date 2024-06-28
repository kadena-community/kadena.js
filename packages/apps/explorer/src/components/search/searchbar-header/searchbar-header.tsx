import { useSearch } from '@/hooks/search';
import type { FC } from 'react';
import React from 'react';
import SearchComponent from '../search-component/search-component';

const SearchBarHeader: FC = () => {
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
    <SearchComponent
      searchOption={searchOption}
      setSearchOption={setSearchOption}
      searchData={searchData}
      setSearchQuery={setSearchQuery}
      searchQuery={searchQuery}
      loading={loading}
      errors={errors}
    />
  );
};

export default SearchBarHeader;
