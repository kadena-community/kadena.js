import { useAccountQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toasts/ToastContext/ToastContext';
import { useEffect, useState } from 'react';
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

export const useAccount = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
): IHookReturnValue<IAccountData[]> => {
  const [cleanedData, setCleanedData] = useState<IAccountData[]>([]);

  const accountQueryVariables = {
    accountName: returnSearchQuery(
      searchQuery,
      searchOption,
      SearchOptionEnum.ACCOUNT,
    ),
  };

  const { addToast } = useToast();
  const { loading, data, error } = useAccountQuery({
    variables: accountQueryVariables,
    skip:
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.ACCOUNT),
  });

  useEffect(() => {
    if (loading || !isSearchRequested(searchOption, SearchOptionEnum.ACCOUNT)) {
      setCleanedData([]);
      return;
    }

    if (!data?.fungibleAccount) return;
    const accountName = data.fungibleAccount.accountName;
    const newData =
      data.fungibleAccount.chainAccounts.reduce<IAccountData[]>((acc, val) => {
        const key = val.guard.keys[0];
        const predicate = val.guard.predicate;

        const item = acc.find(
          (item) => item.key === key && item.predicate === predicate,
        );

        if (item) {
          item.chains = item.chains + 1;
          item.balance = item.chains + val.balance;
        } else {
          acc.push({
            predicate,
            key,
            chains: 1,
            balance: val.balance,
            accountName,
          });
        }

        return acc;
      }, []) ?? [];

    setCleanedData(newData);
  }, [data, loading]);

  useEffect(() => {
    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of account data failed',
      });
    }
  }, [error]);

  return {
    loading,
    data: cleanedData,
  };
};
