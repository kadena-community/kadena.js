import type { Exact, Scalars } from '@/__generated__/sdk';
import {
  useEventsQuery,
  useEventSubscriptionSubscription,
} from '@/__generated__/sdk';
import { coreEvents } from '@/services/graph/agent.graph';
import { env } from '@/utils/env';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { filterRemovedRecords } from '@/utils/filterRemovedRecords';
import { getAsset } from '@/utils/getAsset';
import { setAliasesToAccounts } from '@/utils/setAliasesToAccounts';
import { store } from '@/utils/store';
import type * as Apollo from '@apollo/client';
import { useEffect, useState } from 'react';

export type EventQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const getEventsDocument = (
  variables: EventQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const getEventsSubscription = (
  variables: EventQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const useGetAgents = () => {
  const [innerData, setInnerData] = useState<IRecord[]>([]);
  const {
    loading: addedLoading,
    data: addedData,
    error,
  } = useEventsQuery({
    variables: {
      qualifiedName: `${getAsset()}.AGENT-ADDED`,
    },
  });

  const { data: removedData, loading: removedLoading } = useEventsQuery({
    variables: {
      qualifiedName: `${getAsset()}.AGENT-REMOVED`,
    },
  });

  const { data: subscriptionAddData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `{getAsset()}.AGENT-ADDED`,
    },
  });

  const { data: subscriptionRemoveData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.AGENT-REMOVED`,
    },
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

    console.log({ subscriptionAddData });
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

    const aliases = await store.getAccounts();
    const filteredData = setAliasesToAccounts(
      [
        ...filterRemovedRecords([
          ...agentsAdded,
          ...agentsRemoved,
          ...addedSubscriptionData,
          ...removedSubscriptionData,
        ]),
      ],
      aliases,
    );

    setInnerData(filteredData ?? []);
  };

  const listenToAccounts = (aliases: IRecord[]) => {
    setInnerData((v) => {
      return setAliasesToAccounts([...v], aliases);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData();
  }, [
    addedData,
    removedData,
    removedLoading,
    addedLoading,
    subscriptionRemoveData,
    subscriptionAddData,
  ]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const off = store.listenToAccounts(listenToAccounts);
    return off;
  }, []);

  return { data: innerData, error, isLoading: addedLoading || removedLoading };
};
