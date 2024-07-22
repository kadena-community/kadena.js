import type { EventsQuery } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toasts/ToastContext/ToastContext';
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
  const { loading, data, error } = useEventsQuery({
    variables: {
      qualifiedName: returnSearchQuery(
        searchQuery,
        searchOption,
        SearchOptionEnum.EVENT,
      ),
    },
    skip:
      !searchQuery || !isSearchRequested(searchOption, SearchOptionEnum.EVENT),
  });

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
