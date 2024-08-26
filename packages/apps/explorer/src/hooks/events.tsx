import type { EventsQuery } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
import { loadingEventData } from '@/components/LoadingSkeleton/loadingData/loadingDataEventquery';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { CONSTANTS } from '@/constants/constants';
import { useNetwork } from '@/context/networksContext';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { block } from '@/graphql/queries/block.graph';
import { useEffect, useState } from 'react';
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
  const { activeNetwork } = useNetwork();

  const { setQueries } = useQueryContext();

  const eventVariables = {
    qualifiedName: router.query.eventname as string,
  };

  useEffect(() => {
    setQueries([{ query: block, variables: eventVariables }]);
  }, []);

  const { addToast } = useToast();
  const { loading, data, error } = useEventsQuery({
    variables: eventVariables,
    skip: !(router.query.eventname as string),
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (error) {
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
  }, [loading, data, error]);

  const handleSubmit = (values: Record<string, string | undefined>) => {
    setIsLoading(true);
    setInnerData([getLoadingData()]);
    const chainsArray: number[] = createArrayOfChains(values.chains);
    setSelectedChains(chainsArray);
    console.log(chainsArray);
  };

  const fetchChainsData = async (chains: number[]) => {
    const promise = await fetch(activeNetwork.graphUrl, {
      method: 'POST',
      headers: {
        accept:
          'application/graphql-response+json, application/json, multipart/mixed',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
      body: JSON.stringify({
        query: `query events {
          ${chains.map(
            (chain) => `
                chain${chain}: events(qualifiedEventName: "coin.TRANSFER", chainId: "${chain}") {
                edges {
                  node {
                    ...CoreEventsFields
                    __typename
                  }
                  __typename
                }
                __typename
              }
              `,
          )}
            
          }

fragment CoreEventsFields on Event {
  chainId
  block {
    height
    __typename
  }
  requestKey
  parameters
  __typename
}
          `,
        variables: {},
        operationName: 'events',
        extensions: {},
      }),
    });

    const result = await promise;
    const data = await result.json();

    const chainData = Object.keys(data.data)
      .map((key) => {
        const chainData = data.data[key];
        const chain = selectedChains.find((v) => key === `chain${v}`) ?? '0';
        return {
          chainId: chain,
          query: chainData,
        };
      })
      .sort((a, b) => {
        return a.chainId > b.chainId ? 1 : -1;
      }) as IEventsQueryView[];

    setInnerData(chainData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedChains.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchChainsData(selectedChains);
    }
  }, [selectedChains]);

  return {
    handleSubmit,
    isLoading,
    innerData,
  };
};
