import { useEventsQuery } from '@/__generated__/sdk';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useEffect, useState } from 'react';
import { useEventsPerChainQuery } from '../eventsPerChainQuery';
import type { IEventsQueryView } from './utils/getChainsViewData';
import { getChainsViewData } from './utils/getChainsViewData';
import { getLoadingData } from './utils/getLoadingData';

interface IProps {
  eventName: string;
  minHeight: number | undefined;
  maxHeight: number | undefined;
  selectedChains: number[];
}

export const useEventData = ({
  eventName,
  minHeight,
  maxHeight,
  selectedChains,
}: IProps) => {
  const { setIsLoading, isLoading } = useSearch();
  const { addToast } = useToast();
  const [innerData, setInnerData] = useState<IEventsQueryView[]>([
    getLoadingData(),
  ]);
  const { setQueries } = useQueryContext();

  const eventVariables = {
    qualifiedName: eventName,
    minHeight,
    maxHeight,
  };

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

  useEffect(() => {
    setQueries([{ query: block, variables: eventVariables }]);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setInnerData([getLoadingData()]);
  };

  return {
    data: innerData,
    startLoading,
    isLoading,
  };
};
