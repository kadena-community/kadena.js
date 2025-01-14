import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IComplianceProps } from '@/services/getComplianceRules';
import { getComplianceRules } from '@/services/getComplianceRules';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';

export type EventSubscriptionQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const useGetComplianceRules = ({ asset }: { asset?: IAsset }) => {
  const [data, setData] = useState<IComplianceProps | undefined>();
  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.COMPLIANCE-UPDATED`,
    },
  });

  const init = async () => {
    const res = await getComplianceRules();

    if (typeof res !== 'number') {
      setData(res);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  useEffect(() => {
    if (!subscriptionData?.events?.length) return;

    subscriptionData.events?.map((event) => {
      const params = JSON.parse(event.parameters ?? '[]');

      const activeRulesKeys = params[0].map(
        ({ refName }: any) => `${refName.namespace}.${refName.name}`,
      );

      console.log({ asset, activeRulesKeys });

      if (!asset) return;
      const newRules: IComplianceProps = {
        ...asset.compliance,
        maxSupply: {
          ...asset.compliance.maxSupply,
          isActive:
            activeRulesKeys.indexOf(asset.compliance.maxSupply.key) > -1,
        },
        maxBalance: {
          ...asset.compliance.maxBalance,
          isActive:
            activeRulesKeys.indexOf(asset.compliance.maxBalance.key) > -1,
        },
        maxInvestors: {
          ...asset.compliance.maxInvestors,
          isActive:
            activeRulesKeys.indexOf(asset.compliance.maxInvestors.key) > -1,
        },
      };

      setData((prev) => ({ ...prev, ...newRules }));
    });
  }, [subscriptionData]);

  return { data };
};
