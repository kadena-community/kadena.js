import { useAccount } from '@/hooks/account';
import { useFreeze } from '@/hooks/freeze';
import { store } from '@/utils/store';
import { Notification, NotificationHeading } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface IProps {
  investorAccount: string;
}

export const InvestorFrozenMessage: FC<IProps> = ({ investorAccount }) => {
  const { isInvestor, account } = useAccount();
  const { frozen } = useFreeze({ investorAccount });
  const [message, setMessage] = useState<string>();

  const init = async () => {
    if (!account) return;
    const result = await store.getFrozenMessage(account.address);
    setMessage(result);
  };

  useEffect(() => {
    if (!frozen || !isInvestor || !account) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [frozen, isInvestor, account]);

  if (!frozen || !isInvestor || !account) return;
  return (
    <Notification intent="warning" role="status" type="stacked">
      <NotificationHeading>The investor account is frozen</NotificationHeading>
      {message}
    </Notification>
  );
};
