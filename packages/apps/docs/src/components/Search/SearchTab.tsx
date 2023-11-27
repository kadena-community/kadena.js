import { useSearch } from '@/hooks/useSearch/useSearch';
import { mapMatches } from '@/pages/api/semanticsearch';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { ITabs } from '../SearchDialog/SearchDialog';
import { SearchResults } from './components/SearchResults';
import type { ISearchProps } from './Search';
import useAlgoliaSearch from './useAlgoliaSearch';

const SearchTab: FC<ISearchProps> = ({
  query,
  hasScroll,
  limitResults,
  selectedTabName = null,
}) => {
  const [tabName, setTabName] = useState<ITabs>(selectedTabName);
  const { metadata, handleSubmit, error, isLoading } =
    useAlgoliaSearch(limitResults);

  const {
    outputStream,
    conversation,
    error: conversationError,
    isLoading: conversationIsLoading,
    handleSubmit: handleConversationSubmit,
  } = useSearch();

  const semanticResults = metadata?.map(mapMatches);

  useEffect(() => {
    if (
      query !== undefined &&
      query.trim() !== '' &&
      tabName !== null &&
      tabName.trim() !== ''
    ) {
      if (tabName === 'docs') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleSubmit(query);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleConversationSubmit(query);
      }
      analyticsEvent(EVENT_NAMES['click:search'], { query, tabName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tabName]);

  const onTabSelect = (tabName: ITabs): void => {
    setTabName(tabName);
  };

  return (
    <SearchResults
      semanticResults={semanticResults}
      semanticIsLoading={isLoading}
      conversation={conversation}
      outputStream={outputStream}
      query={query}
      error={error || conversationError}
      isLoading={conversationIsLoading}
      hasScroll={hasScroll}
      onTabSelect={onTabSelect}
      limitResults={limitResults}
    />
  );
};

export default SearchTab;
