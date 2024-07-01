import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import type { ISearchItem } from '@/components/search/search-component/search-component';
import type { ApolloError } from '@apollo/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from './utils/account';
import { useBlockHash } from './utils/block-hash';
import { useBlockHeight } from './utils/block-height';
import { useEvent } from './utils/event';
import {
  SearchOptionEnum,
  checkLoading,
  isSearchRequested,
  returnSearchQuery,
} from './utils/utils';

export interface IHookReturnValue<T> {
  loading: boolean;
  error?: ApolloError;
  data?: T;
}

export const useSearch = () => {
  const router = useRouter();
  const location = usePathname();
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ApolloError[]>([]);
  const [searchOption, setSearchOption] = useState<SearchOptionEnum | null>(
    null,
  );

  const {
    loading: accountLoading,
    data: accountData,
    error: accountError,
  } = useAccount(searchQuery, searchOption);

  const {
    loading: blockLoading,
    data: blockData,
    error: blockError,
  } = useBlockHash(searchQuery, searchOption);

  const {
    loading: blockHeightLoading,
    data: blockHeightData,
    error: blockHeightError,
  } = useBlockHeight(searchQuery, searchOption);

  const {
    loading: eventLoading,
    data: eventData,
    error: eventError,
  } = useEvent(searchQuery, searchOption);
  const {
    loading: requestKeyLoading,
    data: requestKeyData,
    error: requestKeyError,
  } = useTransactionRequestKeyQuery({
    variables: {
      requestKey: returnSearchQuery(
        searchQuery,
        searchOption,
        SearchOptionEnum.REQUESTKEY,
      ),
    },
    skip:
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.REQUESTKEY),
  });

  useEffect(() => {
    if (!isMounted) return;

    if (!searchQuery) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace(`${location}`);
      return;
    }

    const q = params.get('q');
    const so = params.get('so');
    const soInt: SearchOptionEnum = parseInt(so as any);

    if (q === searchQuery && soInt === searchOption) return;

    if (searchOption === SearchOptionEnum.ACCOUNT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/?q=${searchQuery}&so=${searchOption}&fungible=coin`);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/?q=${searchQuery}&so=${searchOption}`);
    }
  }, [searchQuery, isMounted]);

  useEffect(() => {
    const q = params.get('q');
    const so = params.get('so');

    const soInt: SearchOptionEnum | null = !isNaN(parseInt(so as any))
      ? parseInt(so as any)
      : null;
    setSearchQuery(q as string);
    setSearchOption(soInt);
    setIsMounted(true);
  }, [params]);

  useEffect(() => {
    setLoading(
      checkLoading(
        accountLoading,
        blockLoading,
        blockHeightLoading,
        eventLoading,
        requestKeyLoading,
      ),
    );
  }, [
    accountLoading,
    blockLoading,
    blockHeightLoading,
    eventLoading,
    requestKeyLoading,
  ]);

  useEffect(() => {
    const errors: ApolloError[] = [];
    if (accountError) errors.push(accountError);
    if (blockError) errors.push(blockError);
    if (eventError) errors.push(eventError);
    if (blockHeightError) errors.push(blockHeightError);
    if (requestKeyError) errors.push(requestKeyError);

    setErrors(errors);
  }, [accountError, blockError, blockHeightError, eventError, requestKeyError]);

  const searchData: ISearchItem[] = [
    { title: 'Account', data: accountData },
    { title: 'Request Key', data: requestKeyData },
    { title: 'Block Hash', data: blockData },
    { title: 'Block Height', data: blockHeightData },
    { title: 'Events', data: eventData },
  ];
  return {
    searchOption,
    setSearchOption,
    setSearchQuery,
    data: searchData,
    searchQuery,
    loading,
    errors,
  };
};
