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
  const [searchOption, setSearchOption] = useState<SearchOptionEnum | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [oldSearchQuery, setOldSearchQuery] = useState<string>('');
  const [oldSearchOption, setOldSearchOption] =
    useState<SearchOptionEnum | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [searchData, setSearchData] = useState<ISearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    switch (true) {
      case router.asPath.startsWith('/event'):
        setSearchOption(SearchOptionEnum.EVENT);
        setOldSearchOption(SearchOptionEnum.EVENT);
        setSearchQuery(router.query.eventname as string);
        setOldSearchQuery(router.query.eventname as string);
        break;
      case router.asPath.startsWith('/account'):
        setSearchOption(SearchOptionEnum.ACCOUNT);
        setOldSearchOption(SearchOptionEnum.ACCOUNT);
        setSearchQuery(router.query.accountName as string);
        setOldSearchQuery(router.query.accountName as string);
        break;
      case router.asPath.startsWith('/block'):
        setSearchOption(SearchOptionEnum.BLOCKHASH);
        setOldSearchOption(SearchOptionEnum.BLOCKHASH);
        setSearchQuery(router.query.hash as string);
        setOldSearchQuery(router.query.hash as string);
        break;
      case router.asPath.startsWith('/height'):
        setSearchOption(SearchOptionEnum.BLOCKHEIGHT);
        setOldSearchOption(SearchOptionEnum.BLOCKHEIGHT);
        setSearchQuery(router.query.height as string);
        setOldSearchQuery(router.query.height as string);
        break;
      case router.asPath.startsWith('/transaction'):
        setSearchOption(SearchOptionEnum.REQUESTKEY);
        setOldSearchOption(SearchOptionEnum.REQUESTKEY);
        setSearchQuery(router.query.requestKey as string);
        setOldSearchQuery(router.query.requestKey as string);
        break;
    }
  }, [router.asPath]);

  useEffect(() => {
    console.log({ searchQuery, oldSearchQuery, searchOption, oldSearchOption });
    if (searchQuery === oldSearchQuery && searchOption === oldSearchOption)
      return;
    if (!searchQuery || searchOption === null) return;

    setOldSearchQuery(searchQuery);
    setOldSearchOption(searchOption);
    // const query = router.query.q;
    // const searchOptionQuery: SearchOptionEnum | null = !isNaN(
    //   parseInt(router.query.so as any),
    // )
    //   ? parseInt(router.query.so as any)
    //   : null;

    if (searchOption === SearchOptionEnum.ACCOUNT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/account/${searchQuery}`);
      return;
    }

    if (searchOption === SearchOptionEnum.EVENT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/event/${searchQuery}`);
      return;
    }

    if (searchOption === SearchOptionEnum.REQUESTKEY) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/transaction/${searchQuery}`);
      return;
    }

    if (searchOption === SearchOptionEnum.BLOCKHEIGHT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/height/${searchQuery}`);
      return;
    }
    if (searchOption === SearchOptionEnum.BLOCKHASH) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/block/${searchQuery}`);
      return;
    }

    // const queryArray = [];
    // if (searchQuery) {
    //   queryArray.push(`q=${searchQuery}`);
    // }
    // if (searchOption !== null && searchOption !== undefined) {
    //   queryArray.push(`so=${searchOption}`);

    //   if (searchOption === SearchOptionEnum.ACCOUNT) {
    //     queryArray.push(`fungible=coin`);
    //   }
    // }

    // if (
    //   (query === searchQuery && searchOptionQuery === searchOption) ||
    //   !queryArray.filter((v) => v.startsWith('q=')).length
    // ) {
    //   return;
    // }

    // // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // router.push(`/?${queryArray.join('&')}`);
  }, [searchQuery, searchOption]);

  return {
    searchOption,
    setSearchOption,
    setSearchQuery,
    data: searchData,
    searchQuery,
    loading,
  };
};
