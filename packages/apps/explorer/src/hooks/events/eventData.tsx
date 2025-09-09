import { EventsDocument } from '@/__generated__/sdk';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useEffect, useState } from 'react';
import { getEventsDocument } from '../eventsPerChainQuery';
import { useGraphQuery } from '../graphquery';
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
  const [innerData, setInnerData] = useState<IEventsQueryView[]>([
    getLoadingData(),
  ]);
  const { setQueries } = useQueryContext();

  const eventVariables = {
    qualifiedName: eventName,
    minHeight,
    maxHeight,
  };

  const { loading, data, error } = useGraphQuery(
    EventsDocument,
    {
      variables: { ...eventVariables },
      skip: !eventVariables.qualifiedName || selectedChains.length > 0,
    },
    {
      errorLabel: 'Loading of events data failed',
    },
  );

  const {
    loading: chainsLoading,
    data: chainsData,
    error: chainsError,
  } = useGraphQuery(
    getEventsDocument({
      ...eventVariables,
      chains: selectedChains,
    }),
    {
      skip: !eventVariables.qualifiedName || selectedChains.length === 0,
    },
    {
      errorLabel: 'Loading of events per chain data failed',
    },
  );

  useEffect(() => {
    if (loading || chainsLoading) {
      setIsLoading(true);
      return;
    }

    if (error || chainsError) {
      setIsLoading(false);
      setInnerData([]);
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData([{ chainId: 'all chains', data: data.events }]);
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
