import { useRouter } from '@/hooks/router';
import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SearchOptionEnum } from './utils/utils';
import { SEARCHOPTIONS } from './utils/utils';

interface ISearchContext {
  searchOption: SearchOptionEnum | null;
  setSearchOption: Dispatch<SetStateAction<SearchOptionEnum | null>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchQuery: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const SearchContext = createContext<ISearchContext>({
  searchOption: null,
  setSearchOption: () => {},
  setSearchQuery: () => {},
  searchQuery: '',
  isLoading: false,
  setIsLoading: () => {},
});

const useSearch = (): ISearchContext => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('Please use QueryContextProvider in parent component');
  }

  return context;
};

const SearchContextProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<SearchOptionEnum | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [oldSearchQuery, setOldSearchQuery] = useState<string>('');
  const [oldSearchOption, setOldSearchOption] =
    useState<SearchOptionEnum | null>(null);

  useEffect(() => {
    switch (true) {
      case router.asPath.startsWith('/event'):
        setSearchOption(SEARCHOPTIONS.EVENT);
        setOldSearchOption(SEARCHOPTIONS.EVENT);
        setSearchQuery(router.query.eventname as string);
        setOldSearchQuery(router.query.eventname as string);
        break;
      case router.asPath.startsWith('/account'):
        setSearchOption(SEARCHOPTIONS.ACCOUNT);
        setOldSearchOption(SEARCHOPTIONS.ACCOUNT);
        setSearchQuery(router.query.accountName as string);
        setOldSearchQuery(router.query.accountName as string);
        break;
      case router.asPath.startsWith('/block'):
        setSearchOption(SEARCHOPTIONS.BLOCKHASH);
        setOldSearchOption(SEARCHOPTIONS.BLOCKHASH);
        setSearchQuery(router.query.hash as string);
        setOldSearchQuery(router.query.hash as string);
        break;
      case router.asPath.startsWith('/height'):
        setSearchOption(SEARCHOPTIONS.BLOCKHEIGHT);
        setOldSearchOption(SEARCHOPTIONS.BLOCKHEIGHT);
        setSearchQuery(router.query.height as string);
        setOldSearchQuery(router.query.height as string);
        break;
      case router.asPath.startsWith('/transaction'):
        setSearchOption(SEARCHOPTIONS.REQUESTKEY);
        setOldSearchOption(SEARCHOPTIONS.REQUESTKEY);
        setSearchQuery(router.query.requestKey as string);
        setOldSearchQuery(router.query.requestKey as string);
        break;
      default:
        setSearchOption(null);
        setOldSearchOption(null);
        setSearchQuery('');
        setOldSearchQuery('');
    }
  }, [router.asPath]);

  useEffect(() => {
    console.log({ searchQuery, oldSearchQuery, searchOption, oldSearchOption });
    if (searchQuery === oldSearchQuery && searchOption === oldSearchOption)
      return;
    if (!searchQuery || searchOption === null) return;

    setOldSearchQuery(searchQuery);
    setOldSearchOption(searchOption);

    if (searchOption === SEARCHOPTIONS.ACCOUNT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/account/${searchQuery}`);
      return;
    }

    if (searchOption === SEARCHOPTIONS.EVENT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/event/${searchQuery}`);
      return;
    }

    if (searchOption === SEARCHOPTIONS.REQUESTKEY) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/transaction/${searchQuery}`);
      return;
    }

    if (searchOption === SEARCHOPTIONS.BLOCKHEIGHT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/height/${searchQuery}`);
      return;
    }
    if (searchOption === SEARCHOPTIONS.BLOCKHASH) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`/block/${searchQuery}`);
      return;
    }
  }, [searchQuery, searchOption]);

  return (
    <SearchContext.Provider
      value={{
        searchOption,
        setSearchOption,
        setSearchQuery,
        searchQuery,
        isLoading,
        setIsLoading,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchContextProvider, useSearch };
