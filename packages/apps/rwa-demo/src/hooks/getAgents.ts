import {
  useEventsQuery,
  useEventSubscriptionSubscription,
} from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { env } from '@/utils/env';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { filterRemovedRecords } from '@/utils/filterRemovedRecords';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';

export const useGetAgents = (asset?: IAsset) => {
  const [innerData, setInnerData] = useState<IRecord[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  const {
    loading: addedLoading,
    data: addedData,
    error,
  } = useEventsQuery({
    variables: {
      qualifiedName: `${getAsset(asset)}.AGENT-ADDED`,
    },
    skip: !shouldFetch,
    fetchPolicy: 'no-cache',
  });

  const { data: removedData, loading: removedLoading } = useEventsQuery({
    variables: {
      qualifiedName: `${getAsset(asset)}.AGENT-REMOVED`,
    },
    skip: !shouldFetch,
    fetchPolicy: 'no-cache',
  });

  const { data: subscriptionAddData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.AGENT-ADDED`,
    },
    skip: !shouldFetch,
  });

  const { data: subscriptionRemoveData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.AGENT-REMOVED`,
    },
    skip: !shouldFetch,
  });

  const initInnerData = async () => {
    if (addedLoading || removedLoading) {
      setInnerData([]);
      return;
    }

    const agentsAdded: IRecord[] =
      addedData?.events.edges.map((edge: any) => {
        return {
          isRemoved: false,
          blockHeight: edge.node.block.height,
          chainId: edge.node.chainId,
          requestKey: edge.node.requestKey,
          accountName: JSON.parse(edge.node.parameters)[0],
          creationTime: new Date(edge.node.block.creationTime).getTime(),
          result: true,
        } as const;
      }) ?? [];

    const agentsRemoved: IRecord[] =
      removedData?.events.edges.map((edge: any) => {
        return {
          isRemoved: true,
          blockHeight: edge.node.block.height,
          chainId: edge.node.chainId,
          requestKey: edge.node.requestKey,
          accountName: JSON.parse(edge.node.parameters)[0],
          creationTime: new Date(edge.node.block.creationTime).getTime(),
          result: true,
        } as const;
      }) ?? [];

    setInnerData([...filterRemovedRecords([...agentsAdded, ...agentsRemoved])]);
  };

  useEffect(() => {
    if (removedLoading || addedLoading) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData();
  }, [
    removedLoading,
    addedLoading,
    addedData?.events.edges.length ?? 0,
    removedData?.events.edges.length ?? 0,
  ]);

  const addSubscriptionData = async () => {
    //listen to add events
    const addedSubscriptionData = (subscriptionAddData?.events
      ?.map((val) => {
        const params = JSON.parse(val.parameters ?? '[]');
        if (params.length) {
          return {
            isRemoved: false,
            result: true,
            accountName: params[0] as string,
            chainId: env.CHAINID,
            requestKey: '',
            creationTime: Date.now(),
          };
        }
      })
      .filter((v) => v !== undefined) ?? []) as IRecord[];

    //listen to remove events
    const removedSubscriptionData: IRecord[] = (subscriptionRemoveData?.events
      ?.map((val) => {
        const params = JSON.parse(val.parameters ?? '[]');
        if (params.length) {
          return {
            isRemoved: true,
            result: true,
            accountName: params[0] as string,
            chainId: env.CHAINID,
            requestKey: '',
            creationTime: Date.now(),
          };
        }
      })
      .filter((v) => v !== undefined) ?? []) as IRecord[];

    setInnerData((oldValues) => [
      ...filterRemovedRecords([
        ...oldValues,
        ...addedSubscriptionData,
        ...removedSubscriptionData,
      ]),
    ]);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    addSubscriptionData();
  }, [subscriptionAddData?.events, subscriptionRemoveData?.events]);

  useEffect(() => {
    setInnerData([]);
    setShouldFetch(false);
  }, [asset?.uuid]);

  const initFetchAgents = () => {
    setShouldFetch(true);
  };

  return {
    data: innerData,
    error,
    isLoading: addedLoading || removedLoading,
    initFetchAgents,
  };
};
