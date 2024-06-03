import { mapMatches } from '@/pages/api/semanticsearch';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { SearchResults } from './components/SearchResults';
import type { ISearchProps } from './Search';
import useAlgoliaSearch from './useAlgoliaSearch';

const SearchTab: FC<ISearchProps> = ({ query, hasScroll, limitResults }) => {
  const { metadata, handleSubmit, error, isLoading } =
    useAlgoliaSearch(limitResults);

  const semanticResults = metadata?.map(mapMatches);

  useEffect(() => {
    if (query !== undefined && query.trim() !== '') {
      handleSubmit(query);
      analyticsEvent(EVENT_NAMES['click:search'], { query });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <SearchResults
      semanticResults={semanticResults}
      semanticIsLoading={isLoading}
      query={query}
      error={error}
      hasScroll={hasScroll}
      limitResults={limitResults}
    />
  );
};

export default SearchTab;
