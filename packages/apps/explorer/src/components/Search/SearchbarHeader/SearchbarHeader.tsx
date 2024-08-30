import { useSearch } from '@/context/searchContext';
import type { FC } from 'react';
import React from 'react';
import { SearchComponent } from '../SearchComponent/SearchComponent';

export const SearchBarHeader: FC = () => {
  const {
    setSearchQuery,
    searchQuery,
    searchOption,
    setSearchOption,
    isLoading,
  } = useSearch();

  return (
    <SearchComponent
      position="header"
      searchOption={searchOption}
      setSearchOption={setSearchOption}
      setSearchQuery={setSearchQuery}
      searchQuery={searchQuery}
      loading={isLoading}
    />
  );
};
