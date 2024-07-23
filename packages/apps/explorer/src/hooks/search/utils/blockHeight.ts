import type { BlocksFromHeightQuery } from '@/__generated__/sdk';
import { useBlocksFromHeightQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { blockHeight } from '@/graphql/queries/block-height.graph';
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
  const { setQueries } = useQueryContext();

  const blockHeightVariables = {
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
  };

  const { loading, data, error } = useBlocksFromHeightQuery({
    variables: blockHeightVariables,
    skip:
      !searchQuery ||
      isNaN(parseInt(searchQuery)) ||
      !isSearchRequested(searchOption, SearchOptionEnum.BLOCKHEIGHT),
  });

  useEffect(() => {
    if (
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.BLOCKHEIGHT)
    )
      return;
    setQueries([
      {
        query: blockHeight,
        variables: blockHeightVariables,
      },
    ]);
  }, [searchQuery, searchOption]);

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
