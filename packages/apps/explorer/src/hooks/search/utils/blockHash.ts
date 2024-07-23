import type { BlockQuery } from '@/__generated__/sdk';
import { useBlockQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { block } from '@/graphql/queries/block.graph';
import { useEffect } from 'react';
import type { IHookReturnValue } from '..';
import {
  SearchOptionEnum,
  isSearchRequested,
  returnSearchQuery,
} from './utils';

export const useBlockHash = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
): IHookReturnValue<BlockQuery> => {
  const blockQueryVariables = {
    hash: returnSearchQuery(
      searchQuery,
      searchOption,
      SearchOptionEnum.BLOCKHASH,
    ),
  };

  const { setQueries } = useQueryContext();
  const { addToast } = useToast();
  const { loading, data, error } = useBlockQuery({
    variables: blockQueryVariables,
    skip:
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.BLOCKHASH),
  });

  useEffect(() => {
    if (
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.BLOCKHASH)
    )
      return;
    setQueries([
      {
        query: block,
        variables: blockQueryVariables,
      },
    ]);
  }, [searchQuery, searchOption]);

  useEffect(() => {
    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of block data failed',
      });
    }
  }, [error]);

  return {
    loading,
    data,
  };
};
