import { useEventsQuery } from '@/__generated__/sdk';

import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useEffect, useState } from 'react';
import { useEventsPerChainQuery } from '../eventsPerChainQuery';
import { useRouter } from '../router';
import { createArrayOfChains } from './utils/createArrayOfChains';
import type { IEventsQueryView } from './utils/getChainsViewData';
import { getChainsViewData } from './utils/getChainsViewData';
import { getLoadingData } from './utils/getLoadingData';

export const useEvents = () => {
  const router = useRouter();
  const { setIsLoading, isLoading } = useSearch();
  const [innerData, setInnerData] = useState<IEventsQueryView[]>([
    getLoadingData(),
  ]);
  const [selectedChains, setSelectedChains] = useState<number[]>([]);
  const [minHeight, setMinHeight] = useState<number | undefined>();
  const [maxHeight, setMaxHeight] = useState<number | undefined>();
  const { setQueries } = useQueryContext();

  const eventVariables = {
    qualifiedName: router.query.eventname as string,
    minHeight,
    maxHeight,
  };

  useEffect(() => {
    setQueries([{ query: block, variables: eventVariables }]);
  }, []);

  const { addToast } = useToast();
  const { loading, data, error } = useEventsQuery({
    variables: { ...eventVariables },
    skip: !eventVariables.qualifiedName || selectedChains.length > 0,
  });

  const {
    loading: chainsLoading,
    data: chainsData,
    error: chainsError,
  } = useEventsPerChainQuery({
    variables: {
      ...eventVariables,
      chains: selectedChains,
    },
    skip: !eventVariables.qualifiedName || selectedChains.length === 0,
  });

  useEffect(() => {
    if (loading || chainsLoading) {
      setIsLoading(true);
      return;
    }

    if (error || chainsError) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of events data failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData([{ chainId: 'all', data: data.events }]);
      }, 200);
    }
    if (chainsData) {
      setTimeout(() => {
        setIsLoading(false);
        const data = getChainsViewData(chainsData, selectedChains);

        setInnerData(data);
      }, 200);
    }
  }, [loading, chainsLoading, data, chainsData, error, chainsError]);

  const handleSubmit = (values: Record<string, string | undefined>): void => {
    setIsLoading(true);
    setInnerData([getLoadingData()]);
    const chainsArray: number[] = createArrayOfChains(values.chains);
    setSelectedChains(chainsArray);
    setMinHeight(values.minHeight ? parseInt(values.minHeight) : undefined);
    setMaxHeight(values.maxHeight ? parseInt(values.maxHeight) : undefined);
  };

  return {
    handleSubmit,
    isLoading,
    innerData,
  };
};
