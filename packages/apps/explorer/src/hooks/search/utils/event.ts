import type { EventsQuery } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
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

  return {
    loading,
    data,
    error,
  };
};
