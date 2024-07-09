import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import { useRouter } from '@/components/routing/useRouter';
import type { ISearchItem } from '@/components/search/search-component/search-component';
import type { ApolloError } from '@apollo/client';
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
      console.log(445, router.asPath);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (router.asPath === '/') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.replace(`${router.asPath}`);
      }
      return;
    }

    const query = router.query.q;
    const searchOptionQuery: SearchOptionEnum = parseInt(
      router.query.so as any,
    );

    if (query === searchQuery && searchOptionQuery === searchOption) return;

    if (searchOption === SearchOptionEnum.ACCOUNT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/?q=${searchQuery}&so=${searchOption}&fungible=coin`);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/?q=${searchQuery}&so=${searchOption}`);
    }
  }, [searchQuery, isMounted]);

  useEffect(() => {
    const query = router.query.q;
    const searchOptionQuery: SearchOptionEnum | null = !isNaN(
      parseInt(router.query.so as any),
    )
      ? parseInt(router.query.so as any)
      : null;

    setSearchQuery(query as string);
    setSearchOption(searchOptionQuery);
    setIsMounted(true);
  }, [router.query]);

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
