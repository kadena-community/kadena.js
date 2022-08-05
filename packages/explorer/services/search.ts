import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { Route } from 'config/Routes';
import { useDebounce } from './debounce';
import { NetworkContext } from './app';
import { useNodeInfo, useSearchInfo } from './api';
import { SearchResult, SearchType } from '../network/search';

export type ISearchData = {
  values: SearchResult[];
  loading?: boolean;
  requested?: boolean;
};

export const useSearch = (type: SearchType) => {
  const { network } = useContext(NetworkContext);

  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string>(
    router.query?.q ? String(router.query?.q) : '',
  );
  const [focused, setFocused] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const debounceSearchValue = useDebounce(searchValue, 1000);

  useEffect(() => {
    if (searchValue !== debounceSearchValue) {
      setSearchLoading(true);
    } else {
      setTimeout(() => setSearchLoading(false), 100);
    }
  }, [searchValue, debounceSearchValue]);

  useEffect(() => {
    if (
      router.query?.q !== undefined &&
      String(router.query?.q) !== searchValue
    ) {
      if (searchValue) {
        router.push(
          { pathname: Route.Search, query: { q: searchValue, type } },
          undefined,
          { scroll: false, shallow: true },
        );
      } else {
        router.push(Route.Root);
      }
    }
  }, [searchValue]);

  useEffect(() => {
    if (router.query?.type) {
      router.push(
        { pathname: Route.Search, query: { q: searchValue, type } },
        undefined,
        { scroll: false, shallow: true },
      );
    }
  }, [type]);

  const nodeInfo = useNodeInfo(network);
  const searchInfo = useSearchInfo(
    network,
    type,
    nodeInfo && debounceSearchValue
      ? {
          ...nodeInfo,
          query: debounceSearchValue,
        }
      : undefined,
  );

  const searchRequestValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setSearchValue(value);
  }, []);

  const dataSearch = useMemo(
    () => ({
      values: searchInfo?.data || [],
      loading: searchLoading || searchInfo?.isLoading,
    }),
    [searchLoading, searchInfo],
  );

  return {
    searchRequestValue,
    searchValue,
    dataSearch,
    setSearchValue,
    focused,
    setFocused,
    nodeInfo,
  };
};
