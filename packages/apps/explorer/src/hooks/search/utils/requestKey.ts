import type { TransactionRequestKeyQuery } from '@/__generated__/sdk';
import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { transactionRequestKey } from '@/graphql/pages/transaction/transaction-requestkey.graph';
import { useEffect } from 'react';
import type { IHookReturnValue } from '..';
import {
  SearchOptionEnum,
  isSearchRequested,
  returnSearchQuery,
} from './utils';

export interface IAccountData {
  predicate: string;
  key: string;
  chains: number;
  balance: number;
  accountName: string;
}

export const useRequestKey = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
): IHookReturnValue<TransactionRequestKeyQuery> => {
  const { setQueries } = useQueryContext();

  const requestKeyQueryVariables = {
    requestKey: returnSearchQuery(
      searchQuery,
      searchOption,
      SearchOptionEnum.REQUESTKEY,
    ),
  };

  const { addToast } = useToast();
  const { loading, data, error } = useTransactionRequestKeyQuery({
    variables: requestKeyQueryVariables,
    skip:
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.REQUESTKEY),
  });

  useEffect(() => {
    if (
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.REQUESTKEY)
    )
      return;
    setQueries([
      {
        query: transactionRequestKey,
        variables: requestKeyQueryVariables,
      },
    ]);
  }, [searchQuery, searchOption]);

  useEffect(() => {
    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of requestKey data failed',
      });
    }
  }, [error]);

  return {
    loading,
    data,
  };
};
