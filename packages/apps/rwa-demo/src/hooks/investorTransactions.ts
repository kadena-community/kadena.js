import type { Exact, Scalars } from '@/__generated__/sdk';
import { useInvestorTransfersEventsQuery } from '@/__generated__/sdk';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';

export type EventSubscriptionQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

interface ITransfer {
  amount: number;
  toAccount: string;
  fromAccount: string;
  requestKey: string;
  creationTime: number;
}

export const useInvestorTransactions = ({
  investorAccount,
}: {
  investorAccount: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [innerData, setInnerData] = useState<ITransfer[]>([]);

  const { data: fromData } = useInvestorTransfersEventsQuery({
    variables: {
      qualifiedName: `${getAsset()}.RECONCILE`,
      parametersFilter: `{\"path\": [\"1\", \"account\"] ,\"string_contains\":\"${investorAccount}\"}`,
    },
  });

  const { data: toData } = useInvestorTransfersEventsQuery({
    variables: {
      qualifiedName: `${getAsset()}.RECONCILE`,
      parametersFilter: `{\"path\": [\"2\", \"account\"] ,\"string_contains\":\"${investorAccount}\"}`,
    },
  });

  const formatData = (data: any) => {
    data?.events?.edges.map(({ node }: any) => {
      const params = JSON.parse(node.parameterText);

      const requestKey = node.requestKey;
      const creationTime = node.block.creationTime;
      const fromAccount = params.length > 1 && params[1].account;
      const toAccount = params.length > 2 && params[2].account;
      let amount = (params.length > 0 && params[0]) ?? 0;
      if (fromAccount === investorAccount) {
        amount = -amount;
      }

      setInnerData((prev) => {
        if (prev.find((d) => d.requestKey === requestKey)) return prev;
        return [
          ...prev,
          {
            amount,
            toAccount: toAccount,
            fromAccount,
            requestKey,
            creationTime,
          },
        ];
      });
    });
  };
  useEffect(() => {
    formatData(toData);
  }, [toData]);

  useEffect(() => {
    if (fromData?.events.edges) {
      setLoading(false);
    }
    formatData(fromData);
  }, [fromData]);

  return { data: innerData, loading };
};
