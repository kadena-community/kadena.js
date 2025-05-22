import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useFreeze } from '@/hooks/freeze';
import { useOrganisation } from '@/hooks/organisation';
import { store } from '@/utils/store';
import { Notification, NotificationHeading } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface IProps {
  investorAccount: string;
}

export const InvestorFrozenMessage: FC<IProps> = ({ investorAccount }) => {
  const { organisation } = useOrganisation();
  const { asset } = useAsset();
  const { isInvestor, account } = useAccount();
  const { frozen } = useFreeze({ investorAccount });
  const [message, setMessage] = useState<string>();

  const init = async () => {
    if (!account) return;
    const result = await store.getFrozenMessage(
      account.address,
      organisation?.id,
      asset,
    );
    setMessage(result);
  };

  useEffect(() => {
    if (!isInvestor || !account) return;

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
