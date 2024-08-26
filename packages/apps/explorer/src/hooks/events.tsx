import type { EventsQuery } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
import { loadingEventData } from '@/components/LoadingSkeleton/loadingData/loadingDataEventquery';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { CONSTANTS } from '@/constants/constants';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useEffect, useState } from 'react';
import { useEventsPerChainQuery } from './eventsPerChainQuery';
import { useRouter } from './router';

interface IEventsQueryView {
  chainId: string;
  query: EventsQuery['events'];
}

const getLoadingData = () => {
  return { chainId: '', query: loadingEventData };
};

const createArrayOfChains = (value: string | undefined): number[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => parseInt(v, 10))
    .filter((v) => v <= CONSTANTS.CHAINCOUNT && v >= 0);
};

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
        setInnerData([{ chainId: 'all', query: data.events }]);
      }, 200);
    }
    if (chainsData) {
      setTimeout(() => {
        setIsLoading(false);
        const data = Object.entries(chainsData)
          .map(([key, innerData]) => {
            const chain =
              selectedChains.find((v) => key === `chains${v}`) ?? '0';
            return {
              chainId: chain,
              query: innerData,
            };
          })
          .sort((a, b) => {
            return a.chainId > b.chainId ? 1 : -1;
          }) as IEventsQueryView[];

        setInnerData(data);
      }, 200);
    }
  }, [loading, chainsLoading, data, chainsData, error, chainsError]);

  const handleSubmit = (values: Record<string, string | undefined>) => {
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
