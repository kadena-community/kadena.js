import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { accountKDABalance } from '@/services/accountKDABalance';
import { useEffect, useState } from 'react';

export const useGetAccountKDABalance = ({
  accountAddress,
}: {
  accountAddress?: string;
}) => {
  const [innerData, setInnerData] = useState(0);

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `coin.TRANSFER`,
    },
  });

  const init = async () => {
    if (!accountAddress) return;
    const res = await accountKDABalance({ accountName: accountAddress });
    setInnerData(res);
  };

  useEffect(() => {
    if (!accountAddress) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [accountAddress]);

  useEffect(() => {
    subscriptionData?.events?.map((event) => {
      const params = JSON.parse(event.parameters ?? '[]');
      console.log({ params }, event);
    });
  }, [subscriptionData]);

  return { data: innerData };
};
