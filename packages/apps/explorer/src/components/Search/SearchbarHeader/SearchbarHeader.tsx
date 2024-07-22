import { useSearch } from '@/hooks/search';
import type { FC } from 'react';
import React from 'react';
import { SearchComponent } from '../SearchComponent/SearchComponent';

export const SearchBarHeader: FC = () => {
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
      position="header"
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
