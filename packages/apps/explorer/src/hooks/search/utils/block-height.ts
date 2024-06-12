import type { BlocksFromHeightsQuery } from '@/__generated__/sdk';
import { useBlocksFromHeightsQuery } from '@/__generated__/sdk';
import type { IHookReturnValue } from '..';
import {
  SearchOptionEnum,
  isSearchRequested,
  returnSearchQuery,
} from './utils';

export const useBlockHeight = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
): IHookReturnValue<BlocksFromHeightsQuery> => {
  const { loading, data, error } = useBlocksFromHeightsQuery({
    variables: {
      startHeight: parseInt(
        returnSearchQuery(
          searchQuery,
          searchOption,
          SearchOptionEnum.BLOCKHEIGHT,
        ),
      ),
      endHeight: parseInt(
        returnSearchQuery(
          searchQuery,
          searchOption,
          SearchOptionEnum.BLOCKHEIGHT,
        ),
      ),
    },
    skip:
      !searchQuery ||
      isNaN(parseInt(searchQuery)) ||
      !isSearchRequested(searchOption, SearchOptionEnum.BLOCKHEIGHT),
  });

  return {
    loading,
    data,
    error,
  };
};
