import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { Route } from 'config/Routes';
import { useDebounce } from 'utils/hooks';
import { NetworkContext } from 'services/app';
import { useNodeInfo, useSearchInfo } from 'services/api';
import { SearchResult, SearchType } from 'network/search';

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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceSearchValue = useDebounce(searchValue, 1000);

  useEffect(() => {
    if (searchValue !== debounceSearchValue) {
      setIsLoading(true);
    } else {
      setTimeout(() => setIsLoading(false), 100);
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

  const dataSearch = {
    values: searchInfo?.data || [],
    loading: isLoading || searchInfo?.isLoading,
  };

  return {
    searchRequestValue,
    searchValue,
    dataSearch,
    setSearchValue,
    isFocused,
    setIsFocused,
    nodeInfo,
  };
};
