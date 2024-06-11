import {
  useBlockQuery,
  useCoreAccountQuery,
  useEventsQuery,
  useTransactionRequestKeyQuery,
} from '@/__generated__/sdk';
import type { ISearchItem } from '@/components/search/search';
import type { ApolloError } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const checkLoading = (...attrs: boolean[]): boolean => {
  return attrs.find((v: boolean) => v === false) ?? false;
};

export const useSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ApolloError[]>([]);

  const {
    loading: accountLoading,
    data: accountData,
    error: accountError,
  } = useCoreAccountQuery({
    variables: {
      accountName: searchQuery ?? '',
    },
    skip: !searchQuery,
  });

  const {
    loading: blockLoading,
    data: blockData,
    error: blockError,
  } = useBlockQuery({
    variables: {
      hash: searchQuery ?? '',
    },
    skip: !searchQuery,
  });

  const {
    loading: eventLoading,
    data: eventData,
    error: eventError,
  } = useEventsQuery({
    variables: {
      qualifiedName: searchQuery ?? '',
    },
    skip: !searchQuery,
  });
  const {
    loading: requestKeyLoading,
    data: requestKeyData,
    error: requestKeyError,
  } = useTransactionRequestKeyQuery({
    variables: {
      requestKey: searchQuery ?? '',
    },
    skip: !searchQuery,
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
    setSearchQuery(q);
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
    { title: 'Block Height' },
    { title: 'Block Hash', data: blockData },
    { title: 'Events', data: eventData },
  ];
  return {
    setSearchQuery,
    data: searchData,
    searchQuery,
    loading,
    errors,
  };
};
