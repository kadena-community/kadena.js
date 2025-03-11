import { useEventSubscriptionFilteredSubscription } from '@/__generated__/sdk';
import { accountKDABalance } from '@/services/accountKDABalance';
import { useEffect, useState } from 'react';

export const useGetAccountKDABalance = ({
  accountAddress,
}: {
  accountAddress?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [innerData, setInnerData] = useState(0);
  const { data: toData } = useEventSubscriptionFilteredSubscription({
    variables: {
      qualifiedName: `coin.TRANSFER`,
      parametersFilter: `{\"array_contains\":\"${accountAddress}\"}`,
    },
  });

  const init = async () => {
    if (!accountAddress) return;
    const res = await accountKDABalance({ accountName: accountAddress });
    setInnerData(res);
    setIsMounted(true);
  };

  const formatData = (data: any) => {
    data?.events?.map(({ parameters }: any) => {
      const params = JSON.parse(parameters);
      const fromAccount = params.length > 1 && params[0];
      const toAccount = params.length > 2 && params[1];
      const amount = params.length >= 3 && params[2];

      if (!amount) return;
      if (fromAccount === accountAddress) {
        setInnerData((oldValue) => oldValue - amount);
      }
      if (toAccount === accountAddress) {
        setInnerData((oldValue) => oldValue + amount);
      }
    });
  };

  useEffect(() => {
    if (!accountAddress) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [accountAddress]);

  useEffect(() => {
    formatData(toData);
  }, [toData]);

  return { data: innerData, isMounted };
};
