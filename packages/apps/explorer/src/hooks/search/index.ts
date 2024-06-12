import {
  useBlockQuery,
  useBlocksFromHeightsQuery,
  useEventsQuery,
  useTransactionRequestKeyQuery,
} from '@/__generated__/sdk';
import type { ISearchItem } from '@/components/search/search';
import type { ApolloError } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount } from './utils/account';
import {
  SearchOptionEnum,
  checkLoading,
  isSearchRequested,
  returnSearchQuery,
} from './utils/utils';

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
  } = useAccount(searchQuery, searchOption);

  const {
    loading: blockLoading,
    data: blockData,
    error: blockError,
  } = useBlockQuery({
    variables: {
      hash: returnSearchQuery(
        searchQuery,
        searchOption,
        SearchOptionEnum.BLOCKHASH,
      ),
    },
    skip:
      !searchQuery ||
      !isSearchRequested(searchOption, SearchOptionEnum.BLOCKHASH),
  });

  const {
    loading: blockHeightLoading,
    data: blockHeightData,
    error: blockHeightError,
  } = useBlocksFromHeightsQuery({
    variables: {
      startHeight: parseInt(
        returnSearchQuery(
          searchQuery,
          searchOption,
          SearchOptionEnum.BLOCKHEIGHT,
        ),
      ),
      endHeight: parseInt(
        returnSearchQuery(
          searchQuery,
          searchOption,
          SearchOptionEnum.BLOCKHEIGHT,
        ),
      ),
    },
    skip:
      !searchQuery ||
      isNaN(parseInt(searchQuery)) ||
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
    if (searchOption === SearchOptionEnum.ACCOUNT) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace(`${router.route}?q=${searchQuery}&fungible=coin`);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace(`${router.route}?q=${searchQuery}`);
    }
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
    accountError && errors.push(accountError);
    blockError && errors.push(blockError);
    eventError && errors.push(eventError);
    blockHeightError && errors.push(blockHeightError);
    requestKeyError && errors.push(requestKeyError);

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
