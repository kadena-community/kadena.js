import {
  useBlockQuery,
  useCoreAccountQuery,
  useEventsQuery,
  useTransactionRequestKeyQuery,
} from '@/__generated__/sdk';
import type { ISearchItem } from '@/components/search/search';
import { SearchOptionEnum } from '@/components/search/search';
import type { ApolloError } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const checkLoading = (...attrs: boolean[]): boolean => {
  return attrs.find((v: boolean) => v === false) ?? false;
};

const isSearchRequested = (
  searchOption: SearchOptionEnum | null,
  requestedSearchOption: SearchOptionEnum,
): boolean => requestedSearchOption === searchOption;

const returnSearchQuery = (
  searchQuery: string,
  searchOption: SearchOptionEnum | null,
  requestedSearchOption: SearchOptionEnum,
): string => {
  if (isSearchRequested(searchOption, requestedSearchOption))
    return searchQuery ?? '';
  console.log(requestedSearchOption, searchOption);

  return '';
};

export const useSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ApolloError[]>([]);
  const [searchOption, setSearchOption] = useState<SearchOptionEnum | null>(
    null,
  );

  const {
    loading: accountLoading,
    data: accountData,
    error: accountError,
  } = useCoreAccountQuery({
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

  const {
    loading: blockLoading,
    data: blockData,
    error: blockError,
  } = useBlockQuery({
    variables: {
      hash: returnSearchQuery(
        searchQuery,
        searchOption,
        SearchOptionEnum.BLOCKHEIGHT,
      ),
    },
    skip:
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.BLOCKHEIGHT),
  });

  const {
    loading: eventLoading,
    data: eventData,
    error: eventError,
  } = useEventsQuery({
    variables: {
      qualifiedName: returnSearchQuery(
        searchQuery,
        searchOption,
        SearchOptionEnum.EVENT,
      ),
    },
    skip:
      !searchQuery || !isSearchRequested(searchOption, SearchOptionEnum.EVENT),
  });
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
    if (!searchQuery) return;
    const { q } = router.query;
    if (q === searchQuery) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(`${router.route}?q=${searchQuery}`);
  }, [searchQuery, router]);

  useEffect(() => {
    const { q } = router.query;
    setSearchQuery(q as string);
  }, [router.isReady]);

  useEffect(() => {
    setLoading(
      checkLoading(
        accountLoading,
        blockLoading,
        eventLoading,
        requestKeyLoading,
      ),
    );
  }, [accountLoading, blockLoading, eventLoading, requestKeyLoading]);

  useEffect(() => {
    const errors: ApolloError[] = [];
    accountError && errors.push(accountError);
    blockError && errors.push(blockError);
    eventError && errors.push(eventError);
    requestKeyError && errors.push(requestKeyError);

    setErrors(errors);
  }, [accountError, blockError, eventError, requestKeyError]);

  const searchData: ISearchItem[] = [
    { title: 'Account', data: accountData },
    { title: 'Request Key', data: requestKeyData },
    { title: 'Block Hash', data: blockData },
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
