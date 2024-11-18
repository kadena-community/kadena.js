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

export const useGetAgents = () => {
  const [innerData, setInnerData] = useState<any[]>([]);
  const { getTransactions, transactions } = useTransactions();
  const { loading, data, error } = useEventsQuery({
    variables: {
      qualifiedName: 'RWA.agent-role.AGENT-ADDED',
    },
  });

  const initInnerData = async (transactions: ITransaction[]) => {
    const promises = transactions.map(async (t) => {
      const result = await t.listener;
      return {
        blockHeight: result?.metaData?.blockHeight,
        chainId: t.data.chainId,
        requestKey: t.requestKey,
        accountName: t.data.agent,
        result: result?.result.status === 'success',
      };
    });

    const promiseResults = await Promise.all(promises);

    const agents =
      data?.events.edges.map((edge: any) => {
        return {
          blockHeight: edge.node.block.height,
          chainId: edge.node.chainId,
          requestKey: edge.node.requestKey,
          accountName: JSON.parse(edge.node.parameters)[0],
          result: true,
        };
      }) ?? [];

    console.log({ agents });

    setInnerData([...agents, ...promiseResults]);
  };

  useEffect(() => {
    const tx = getTransactions('ADDAGENT');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData(tx);
  }, [transactions, data]);

  return { loading, data: innerData, error };
};
