import { useFreeze } from '@/hooks/freeze';
import { Notification } from '@kadena/kode-ui';
import type { FC } from 'react';

interface IProps {
  investorAccount: string;
}

export const InvestorFrozenMessage: FC<IProps> = ({ investorAccount }) => {
  const { frozen } = useFreeze({ investorAccount });

  if (!frozen) return;
  return (
    <Notification intent="info" role="status">
      The investor account is frozen
    </Notification>
  );
};
