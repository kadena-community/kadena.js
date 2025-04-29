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

  const cleanedBalance = balance < 0 ? 0 : balance;
  if (short) {
    return (
      <Stack alignItems="center" gap="xs" data-testid="balance-info">
        <TransactionTypeSpinner
          type={[
            TXTYPES.DISTRIBUTETOKENS,
            TXTYPES.TOKENSFROZEN,
            TXTYPES.TOKENSUNFROZEN,
            TXTYPES.TRANSFERTOKENS,
          ]}
          account={investorAccount}
        />
        <MaxInvestorBalanceCheck balance={cleanedBalance} />
        {cleanedBalance} (<MonoFilterTiltShift /> {frozenData})
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" gap="xs" data-testid="balance-info">
      <MaxInvestorBalanceCheck balance={cleanedBalance} />
      balance:{' '}
      <TransactionTypeSpinner
        type={[
          TXTYPES.DISTRIBUTETOKENS,
          TXTYPES.TOKENSFROZEN,
          TXTYPES.TOKENSUNFROZEN,
          TXTYPES.TRANSFERTOKENS,
        ]}
        account={investorAccount}
      />
      {cleanedBalance} (<MonoFilterTiltShift /> {frozenData})
    </Stack>
  );
};
