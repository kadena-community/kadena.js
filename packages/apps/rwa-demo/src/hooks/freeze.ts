import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { isFrozen } from '@/services/isFrozen';
import { getAsset } from '@/utils/getAsset';
import type * as Apollo from '@apollo/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';

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
  const { asset } = useAsset();
  const [frozen, setFrozen] = useState<boolean>(true);

  const { data } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.ADDRESS-FROZEN`,
    },
  });

  useEffect(() => {
    const init = async (
      accountProp: IWalletAccount,
      investorAccountProp: string,
      asset: IAsset,
    ) => {
      const res = await isFrozen(
        {
          investorAccount: investorAccountProp,
          account: accountProp,
        },
        asset,
      );

      if (typeof res === 'boolean') {
        setFrozen(res);
      }
    };

    if (!account?.address || !investorAccount || !asset) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(account, investorAccount, asset);
  }, [account?.address, investorAccount, asset]);

  useEffect(() => {
    if (!data?.events?.length) return;

    data?.events?.map((evt) => {
      const params = JSON.parse(evt.parameters ?? '[]');
      if (params.length < 2 || params[0] !== investorAccount) return;

      setFrozen(params[1]);
    });
  }, [data]);

  return { frozen };
};
