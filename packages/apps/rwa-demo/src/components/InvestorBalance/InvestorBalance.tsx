import { useAccount } from '@/hooks/account';
import { useGetFrozenTokens } from '@/hooks/getFrozenTokens';
import { MonoFilterTiltShift } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { MaxInvestorBalanceCheck } from './MaxInvestorBalanceCheck';

interface IProps {
  investorAccount: string;
  short?: boolean;
}

export const InvestorBalance: FC<IProps> = ({
  investorAccount,
  short = false,
}) => {
  const { balance } = useAccount();
  const { data: frozenData } = useGetFrozenTokens({ investorAccount });

  if (short) {
    return (
      <Stack alignItems="center" gap="xs">
        <MaxInvestorBalanceCheck balance={balance} />
        {balance} (<MonoFilterTiltShift /> {frozenData})
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" gap="xs">
      <MaxInvestorBalanceCheck balance={balance} />
      investorBalance: {balance} (<MonoFilterTiltShift /> {frozenData})
    </Stack>
  );
};
