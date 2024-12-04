import type { Exact, Scalars } from '@/__generated__/sdk';
import { coreEvents } from '@/services/graph/agent.graph';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import type { IRecord } from '@/utils/filterRemovedRecords';
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

export const useGetInvestor = ({ account }: { account: string }) => {
  const [innerData, setInnerData] = useState<IRecord | undefined>();

  const listenToAccount = (result: IRegisterIdentityProps) => {
    setInnerData((v: any) => {
      if (v) return { ...v, alias: result.alias };
      return {
        alias: result.alias,
        account: result.accountName,
      };
    });
  };

  const initInnerData = async () => {
    const data = await store.getAccount({ account });
    store.listenToAccount(account, listenToAccount);

    if (!data) return;

    setInnerData({
      accountName: account,
      alias: data.alias,
      creationTime: 0,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData();
  }, [account]);

  return { data: innerData };
};
