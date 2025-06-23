import {
  useEventsQuery,
  useEventSubscriptionSubscription,
} from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { filterRemovedRecords } from '@/utils/filterRemovedRecords';
import { getAsset } from '@/utils/getAsset';
import { useCallback, useEffect, useState } from 'react';

export const useGetInvestors = (asset?: IAsset) => {
  const [innerData, setInnerData] = useState<IRecord[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  const {
    loading: addedLoading,
    data: addedData,
    error,
  } = useEventsQuery({
    variables: {
      qualifiedName: `${getAsset(asset)}.IDENTITY-REGISTERED`,
    },
    skip: !shouldFetch,
    fetchPolicy: 'no-cache',
  });

  const { data: removedData, loading: removedLoading } = useEventsQuery({
    variables: {
      qualifiedName: `${getAsset(asset)}.IDENTITY-REMOVED`,
    },
    skip: !shouldFetch,
    fetchPolicy: 'no-cache',
  });

  const { data: addedSubscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.IDENTITY-REGISTERED`,
    },
    skip: !shouldFetch,
  });

  const { data: removedSubscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.IDENTITY-REMOVED`,
    },
    skip: !shouldFetch,
  });

  const initInnerData = async () => {
    if (addedLoading || removedLoading) {
      setInnerData([]);
      return;
    }

    const investorsAdded: IRecord[] =
      addedData?.events.edges.map((edge: any) => {
        return {
          isRemoved: false,
          blockHeight: edge.node.block.height,
          chainId: edge.node.chainId,
          requestKey: edge.node.requestKey,
          accountName: JSON.parse(edge.node.parameters)[0],
          creationTime: edge.node.block.creationTime,
          result: true,
        } as const;
      }) ?? [];

    const investorsRemoved: IRecord[] =
      removedData?.events.edges.map((edge: any) => {
        return {
          isRemoved: true,
          blockHeight: edge.node.block.height,
          chainId: edge.node.chainId,
          requestKey: edge.node.requestKey,
          accountName: JSON.parse(edge.node.parameters)[0],
          creationTime: edge.node.block.creationTime,
          result: true,
        } as const;
      }) ?? [];

    setInnerData([
      ...filterRemovedRecords([...investorsAdded, ...investorsRemoved]),
    ]);
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

  const addSubscriptionData = useCallback(async () => {
    const investorsSubscriptionAdded: IRecord[] =
      addedSubscriptionData?.events?.map((edge: any) => {
        const params = JSON.parse(edge.parameters);
        return {
          isRemoved: false,
          accountName: params[0],
          creationTime: Date.now(),
          result: true,
        } as IRecord;
      }) ?? [];

    const investorsSubscriptionRemoved: IRecord[] =
      removedSubscriptionData?.events?.map((edge: any) => {
        const params = JSON.parse(edge.parameters);
        return {
          isRemoved: true,
          accountName: params[0],
          creationTime: Date.now(),
          result: true,
        } as IRecord;
      }) ?? [];

    setInnerData((oldValues) => [
      ...filterRemovedRecords([
        ...oldValues,
        ...investorsSubscriptionAdded,
        ...investorsSubscriptionRemoved,
      ]),
    ]);
  }, [addedSubscriptionData?.events, removedSubscriptionData?.events]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    addSubscriptionData();
  }, [addSubscriptionData]);

  useEffect(() => {
    setInnerData([]);
    setShouldFetch(false);
  }, [asset?.uuid]);

  const initFetchInvestors = () => {
    setShouldFetch(true);
  };

  return {
    data: innerData,
    error,
    isLoading: removedLoading || addedLoading,
    initFetchInvestors,
  };
};
