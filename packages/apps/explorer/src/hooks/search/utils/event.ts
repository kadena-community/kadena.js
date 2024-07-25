import type { EventsQuery } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { coreEvents } from '@/graphql/queries/events.graph';
import { useEffect } from 'react';
import type { IHookReturnValue } from '..';
import {
  SearchOptionEnum,
  isSearchRequested,
  returnSearchQuery,
} from './utils';

export const useEvent = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
): IHookReturnValue<EventsQuery> => {
  const { addToast } = useToast();
  const { setQueries } = useQueryContext();
  const eventVariables = {
    qualifiedName: returnSearchQuery(
      searchQuery,
      searchOption,
      SearchOptionEnum.EVENT,
    ),
  };
  const { loading, data, error } = useEventsQuery({
    variables: eventVariables,
    skip:
      !searchQuery || !isSearchRequested(searchOption, SearchOptionEnum.EVENT),
  });

  useEffect(() => {
    if (
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.EVENT)
    )
      return;
    setQueries([
      {
        query: coreEvents,
        variables: eventVariables,
      },
    ]);
  }, [searchQuery, searchOption]);

  useEffect(() => {
    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of events failed',
      });
    }
  }, [error]);

  return {
    loading,
    data,
  };
};
