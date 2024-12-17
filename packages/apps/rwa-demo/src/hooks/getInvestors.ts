import type { Exact, Scalars } from '@/__generated__/sdk';
import {
  useEventsQuery,
  useEventSubscriptionSubscription,
} from '@/__generated__/sdk';
import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { coreEvents } from '@/services/graph/agent.graph';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { filterRemovedRecords } from '@/utils/filterRemovedRecords';
import { getAsset } from '@/utils/getAsset';
import { setAliasesToAccounts } from '@/utils/setAliasesToAccounts';
import { store } from '@/utils/store';
import type * as Apollo from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTransactions } from './transactions';

export type EventQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const getEventsDocument = (
  variables: EventQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const useGetInvestors = () => {
  const [innerData, setInnerData] = useState<IRecord[]>([]);
  const { getTransactions, transactions } = useTransactions();
  const {
    loading: addedLoading,
    data: addedData,
    error,
  } = useEventsQuery({
    variables: {
      qualifiedName: `${getAsset()}.IDENTITY-REGISTERED`,
    },
  });

  const { data: removedData, loading: removedLoading } = useEventsQuery({
    variables: {
      qualifiedName: `${getAsset()}.IDENTITY-REMOVED`,
    },
  });

  const { data: addedSubscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.IDENTITY-REGISTERED`,
    },
  });

  const { data: removedSubscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.IDENTITY-REMOVED`,
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
          creationTime: edge.node.block.creationTime,
          alias: '',
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
          creationTime: edge.node.block.creationTime,
          alias: '',
          result: true,
        } as const;
      }) ?? [];

    const agentsSubscriptionAdded: IRecord[] =
      addedSubscriptionData?.events?.map((edge: any) => {
        const params = JSON.parse(edge.parameters);
        return {
          isRemoved: false,
          accountName: params[0],
          alias: '',
          creationTime: Date.now(),
          result: true,
        } as IRecord;
      }) ?? [];

    const agentsSubscriptionRemoved: IRecord[] =
      removedSubscriptionData?.events?.map((edge: any) => {
        const params = JSON.parse(edge.parameters);
        return {
          isRemoved: true,
          accountName: params[0],
          alias: '',
          creationTime: Date.now(),
          result: true,
        } as IRecord;
      }) ?? [];

    const aliases = await store.getAccounts();

    setInnerData(
      setAliasesToAccounts(
        [
          ...filterRemovedRecords([
            ...agentsAdded,
            ...agentsRemoved,
            ...agentsSubscriptionAdded,
            ...agentsSubscriptionRemoved,
          ]),
        ],
        aliases,
      ),
    );
  };

  const listenToAccounts = (aliases: IRegisterIdentityProps[]) => {
    setInnerData((v) => {
      return setAliasesToAccounts([...v], aliases);
    });
  };

  useEffect(() => {
    //const tx = getTransactions('IDENTITY-REGISTERED');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises

    if (removedLoading || addedLoading) return;

    console.log([
      addedData?.events.edges.length,
      removedData?.events.edges.length,
      addedSubscriptionData?.events?.length,
      removedSubscriptionData?.events?.length,
    ]);

    initInnerData();
  }, [
    removedLoading,
    addedLoading,
    addedData?.events.edges.length ?? 0,
    removedData?.events.edges.length ?? 0,
    addedSubscriptionData?.events?.length ?? 0,
    removedSubscriptionData?.events?.length ?? 0,
  ]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const off = store.listenToAccounts(listenToAccounts);
    return off;
  }, []);

  return { data: innerData, error, isLoading: removedLoading || addedLoading };
};
