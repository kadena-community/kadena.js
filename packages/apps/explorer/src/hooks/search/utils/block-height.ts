import type { BlocksFromHeightQuery } from '@/__generated__/sdk';
import { useBlocksFromHeightQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toasts/ToastContext/ToastContext';
import { useEffect } from 'react';
import type { IHookReturnValue } from '..';
import {
  SearchOptionEnum,
  isSearchRequested,
  returnSearchQuery,
} from './utils';

export const useBlockHeight = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
): IHookReturnValue<BlocksFromHeightQuery> => {
  const { addToast } = useToast();
  const { loading, data, error } = useBlocksFromHeightQuery({
    variables: {
      first: 200,
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

  useEffect(() => {
    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of blocks data from height failed',
      });
    }
  }, [error]);

  return {
    loading,
    data,
  };
};
