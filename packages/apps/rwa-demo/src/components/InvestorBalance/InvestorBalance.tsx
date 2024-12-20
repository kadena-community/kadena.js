import { useGetFrozenTokens } from '@/hooks/getFrozenTokens';
import { useGetInvestorBalance } from '@/hooks/getInvestorBalance';
import { MonoFilterTiltShift } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';
import { MaxInvestorBalanceCheck } from './MaxInvestorBalanceCheck';

interface IProps {
  investorAccount: string;
  short?: boolean;
}

export const InvestorBalance: FC<IProps> = ({
  investorAccount,
  short = false,
}) => {
  const { data: balance } = useGetInvestorBalance({
    investorAccount,
  });
  const { data: frozenData } = useGetFrozenTokens({ investorAccount });

  if (short) {
    return (
      <Stack alignItems="center" gap="xs">
        <TransactionTypeSpinner
          type={[
            TXTYPES.DISTRIBUTETOKENS,
            TXTYPES.PARTIALLYFREEZETOKENS,
            TXTYPES.TRANSFERTOKENS,
          ]}
          account={investorAccount}
        />
        <MaxInvestorBalanceCheck balance={balance} />
        {balance} (<MonoFilterTiltShift /> {frozenData})
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" gap="xs">
      <MaxInvestorBalanceCheck balance={balance} />
      investorBalance:{' '}
      <TransactionTypeSpinner
        type={[
          TXTYPES.DISTRIBUTETOKENS,
          TXTYPES.PARTIALLYFREEZETOKENS,
          TXTYPES.TRANSFERTOKENS,
        ]}
        account={investorAccount}
      />
      {balance} (<MonoFilterTiltShift /> {frozenData})
    </Stack>
  );
};
