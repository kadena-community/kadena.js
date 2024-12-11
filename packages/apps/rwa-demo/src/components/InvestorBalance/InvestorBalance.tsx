import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { useAccount } from '@/hooks/account';
import { getBalance } from '@/services/getBalance';
import { getFrozenTokens } from '@/services/getFrozenTokens';
import { MonoFilterTiltShift } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { MaxInvestorBalanceCheck } from './MaxInvestorBalanceCheck';

interface IProps {
  investorAccount: string;
  short?: boolean;
}

export const InvestorBalance: FC<IProps> = ({
  investorAccount,
  short = false,
}) => {
  const { account } = useAccount();
  const [data, setData] = useState(0);
  const [frozenData, setFrozenData] = useState(0);

  const init = async (account: IWalletAccount, investorAccount: string) => {
    if (!account || !investorAccount) return;
    const res = await getBalance({ investorAccount, account: account! });

    if (typeof res === 'number') {
      setData(res);
    }

    const frozenRes = await getFrozenTokens({
      investorAccount,
      account: account!,
    });

    if (typeof frozenRes === 'number') {
      setFrozenData(frozenRes);
    }
  };

  useEffect(() => {
    if (!account || !investorAccount) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(account, investorAccount);
  }, [account?.address, investorAccount]);

  if (short) {
    return (
      <Stack alignItems="center" gap="xs">
        <MaxInvestorBalanceCheck balance={data} />
        {data} (<MonoFilterTiltShift /> {frozenData})
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" gap="xs">
      <MaxInvestorBalanceCheck balance={data} />
      investorBalance: {data} (<MonoFilterTiltShift /> {frozenData})
    </Stack>
  );
};
