import { useAccountQuery } from '@/__generated__/sdk';
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
}

export const useAccount = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
): IHookReturnValue<IAccountData[]> => {
  const [cleanedData, setCleanedData] = useState<IAccountData[]>([]);
  const { loading, data, error } = useAccountQuery({
    variables: {
      accountName: returnSearchQuery(
        searchQuery,
        searchOption,
        SearchOptionEnum.ACCOUNT,
      ),
    },
    skip:
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.ACCOUNT),
  });

  useEffect(() => {
    const newData =
      data?.fungibleAccount?.chainAccounts?.reduce<IAccountData[]>(
        (acc, val) => {
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
            });
          }

          return acc;
        },
        [],
      ) ?? [];

    setCleanedData(newData);
  }, [data]);

  return {
    loading,
    error,
    data: cleanedData,
  };
};
