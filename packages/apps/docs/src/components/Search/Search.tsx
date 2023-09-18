import { SearchResults } from './components/SearchResults';
import useAlgoliaSearch from './useAlgoliaSearch';

import { useSearch } from '@/hooks';
import { mapMatches } from '@/pages/api/semanticsearch';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

interface IProps {
  query?: string;
  hasScroll?: boolean;
  limitResults?: number;
}

export const Search: FC<IProps> = ({ query, hasScroll, limitResults }) => {
  const [tabName, setTabName] = useState<string | undefined>();
  const {
    metadata = [],
    // outputStream,
    handleSubmit,
    // conversation,
    error,
    isLoading,
  } = useAlgoliaSearch(limitResults);

  const semanticResults = metadata.map(mapMatches);

  console.log('Search.tsx: semanticResults: ', semanticResults);

  useEffect(() => {
    if (
      query !== undefined &&
      query.trim() !== '' &&
      tabName !== undefined &&
      tabName.trim() !== ''
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleSubmit(query);
      analyticsEvent(EVENT_NAMES['click:search'], { query, tabName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tabName]);

  const onTabSelect = (tabName: string): void => {
    setTabName(tabName);
  };

  return (
    <section>
      <SearchResults
        semanticResults={semanticResults}
        semanticIsLoading={isLoading}
        outputStream="outoputStream"
        query={query}
        error={error}
        isLoading={isLoading}
        hasScroll={hasScroll}
        onTabSelect={onTabSelect}
        limitResults={limitResults}
      />
    </section>
  );
};
