import { useAccount } from '@/hooks/account';
import type { FC } from 'react';
import { InvestorFrozenMessage } from '../InvestorFrozenMessage/InvestorFrozenMessage';

export const FrozenInvestorBanner: FC = () => {
  const { account } = useAccount();
  if (!account) return;
  return <InvestorFrozenMessage investorAccount={account.address} />;
};
