import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { isFrozen } from '@/services/isFrozen';
import { getAsset } from '@/utils/getAsset';
import type * as Apollo from '@apollo/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';

export type EventSubscriptionQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const getEventsDocument = (
  variables: EventSubscriptionQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const useFreeze = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const { account } = useAccount();
  const [frozen, setFrozen] = useState(true);

  const { data } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.ADDRESS-FROZEN`,
    },
  });

  const init = async () => {
    if (!account) return;
    const res = await isFrozen({
      investorAccount: investorAccount!,
      account: account,
    });

    if (typeof res === 'boolean') {
      setFrozen(res);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [account?.address]);

  useEffect(() => {
    if (!data?.events?.length) return;
    const params = JSON.parse(data?.events[0].parameters ?? '[]');
    if (params.length < 2 || params[0] !== investorAccount) return;

    setFrozen(params[1]);
  }, [data]);

  return { frozen };
};
