import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useFreeze } from '@/hooks/freeze';
import { useOrganisation } from '@/hooks/organisation';
import { useUser } from '@/hooks/user';
import { RWAStore } from '@/utils/store';
import { Notification, NotificationHeading } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

interface IProps {
  investorAccount: string;
}

export const InvestorFrozenMessage: FC<IProps> = ({ investorAccount }) => {
  const { asset } = useAsset();
  const { user } = useUser();
  const { isInvestor, account } = useAccount();
  const { frozen } = useFreeze({ investorAccount });
  const [message, setMessage] = useState<string>();
  const { organisation } = useOrganisation();
  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  useEffect(() => {
    if (!isInvestor || !account) return;

    const init = async () => {
      if (!account || !user) return;
      const result = await store?.getFrozenMessage(
        account.address,
        user,
        asset,
      );
      setMessage(result);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [frozen, isInvestor, account, user]);

  if (!frozen || !isInvestor || !account) return;
  return (
    <Notification
      intent="warning"
      role="status"
      type="inlineStacked"
      contentMaxWidth={1000}
    >
      <NotificationHeading>The investor account is frozen</NotificationHeading>
      {message}
    </Notification>
  );
};
