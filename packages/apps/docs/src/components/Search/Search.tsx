import { SearchResults } from './components/SearchResults';
import useAlgoliaSearch from './useAlgoliaSearch';

import { useSearch } from '@/hooks/useSearch/useSearch';
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
  const [tabName, setTabName] = useState<string | undefined>('docs');
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
      tabName !== undefined &&
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

  const onTabSelect = (tabName: string): void => {
    setTabName(tabName);
  };

  return (
    <section>
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
    </section>
  );
};
