import type { ISearchItem } from '@/components/Search/SearchComponent/SearchComponent';
import type { ApolloError } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from './../router';
import { useAccount } from './utils/account';
import { useBlockHash } from './utils/blockHash';
import { useBlockHeight } from './utils/blockHeight';
import { useEvent } from './utils/event';
import { useRequestKey } from './utils/requestKey';
import { SearchOptionEnum, checkLoading } from './utils/utils';

export interface IHookReturnValue<T> {
  loading: boolean;
  error?: ApolloError;
  data?: T;
}

export const useSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [searchData, setSearchData] = useState<ISearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchOption, setSearchOption] = useState<SearchOptionEnum | null>(
    null,
  );

  const { loading: accountLoading, data: accountData } = useAccount(
    searchQuery,
    searchOption,
  );

  const { loading: blockLoading, data: blockData } = useBlockHash(
    searchQuery,
    searchOption,
  );

  const { loading: blockHeightLoading, data: blockHeightData } = useBlockHeight(
    searchQuery,
    searchOption,
  );

  const { loading: eventLoading, data: eventData } = useEvent(
    searchQuery,
    searchOption,
  );

  const { loading: requestKeyLoading, data: requestKeyData } = useRequestKey(
    searchQuery,
    searchOption,
  );

  useEffect(() => {
    if (!isMounted) return;

    const query = router.query.q;
    const searchOptionQuery: SearchOptionEnum | null = !isNaN(
      parseInt(router.query.so as any),
    )
      ? parseInt(router.query.so as any)
      : null;

    const queryArray = [];
    if (searchQuery) {
      queryArray.push(`q=${searchQuery}`);
    }
    if (searchOption !== null && searchOption !== undefined) {
      queryArray.push(`so=${searchOption}`);

      if (searchOption === SearchOptionEnum.ACCOUNT) {
        queryArray.push(`fungible=coin`);
      }
    }

    if (
      (query === searchQuery && searchOptionQuery === searchOption) ||
      !queryArray.filter((v) => v.startsWith('q=')).length
    ) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push(`/?${queryArray.join('&')}`);
  }, [searchQuery, searchOption, isMounted]);

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
    if (loading) {
      setSearchData([
        { title: 'Account', data: [] },
        { title: 'Request Key', data: {} },
        { title: 'Block Hash', data: {} },
        { title: 'Height', data: {} },
        { title: 'Event', data: {} },
      ]);
      return;
    }

    const result: ISearchItem[] = [
      { title: 'Account', data: accountData },
      { title: 'Request Key', data: requestKeyData },
      { title: 'Block Hash', data: blockData },
      { title: 'Height', data: blockHeightData },
      { title: 'Event', data: eventData },
    ];

    setSearchData(result);
  }, [
    loading,
    accountData,
    requestKeyData,
    blockData,
    blockHeightData,
    eventData,
  ]);

  useEffect(() => {
    const loadingResult = checkLoading(
      accountLoading,
      blockLoading,
      blockHeightLoading,
      eventLoading,
      requestKeyLoading,
    );

    if (!loadingResult) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }
  }, [
    accountLoading,
    blockLoading,
    blockHeightLoading,
    eventLoading,
    requestKeyLoading,
  ]);

  return {
    searchOption,
    setSearchOption,
    setSearchQuery,
    data: searchData,
    searchQuery,
    loading,
  };
};
