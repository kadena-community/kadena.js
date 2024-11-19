import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { coreEvents } from '@/services/graph/agent.graph';
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

interface IRecord {
  isRemoved?: boolean;
  blockHeight?: number;
  chainId: string;
  requestKey: string;
  accountName: string;
  creationTime: string;
  result: boolean;
}

const sortAgents = (arr: IRecord[]): IRecord[] => {
  return arr
    .sort((a, b) => {
      if (
        new Date(a.creationTime).getTime() < new Date(b.creationTime).getTime()
      )
        return -1;
      return 1;
    })
    .reduce((acc: IRecord[], val: IRecord) => {
      if (val.isRemoved) {
        const newAcc = acc.filter((v) => v.accountName !== val.accountName);
        return newAcc;
      }
      acc.push(val);
      return acc;
    }, []);
};

export const useGetAgents = () => {
  const [innerData, setInnerData] = useState<IRecord[]>([]);
  const { getTransactions, transactions } = useTransactions();
  const {
    loading: addedLoading,
    data: addedData,
    error,
  } = useEventsQuery({
    variables: {
      qualifiedName: 'RWA.agent-role.AGENT-ADDED',
    },
  });

  const { data: removedData, loading: removedLoading } = useEventsQuery({
    variables: {
      qualifiedName: 'RWA.agent-role.AGENT-REMOVED',
    },
  });

  const initInnerData = async (transactions: ITransaction[]) => {
    if (addedLoading || removedLoading) {
      setInnerData([]);
      return;
    }

    const promises = transactions.map(async (t): Promise<IRecord> => {
      const result = await t.listener;
      return {
        blockHeight: result?.metaData?.blockHeight,
        chainId: t.data.chainId,
        requestKey: t.requestKey,
        accountName: t.data.agent,
        result: result?.result.status === 'success',
      } as IRecord;
    });
    const promiseResults = await Promise.all(promises);

    const agentsAdded: IRecord[] =
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

    const agentsRemoved: IRecord[] =
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
      ...sortAgents([...agentsAdded, ...agentsRemoved]),
      ...promiseResults,
    ]);
  };

  useEffect(() => {
    const tx = getTransactions('ADDAGENT');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData(tx);
  }, [transactions, addedData, removedData, removedLoading, addedLoading]);

  return { data: innerData, error };
};
