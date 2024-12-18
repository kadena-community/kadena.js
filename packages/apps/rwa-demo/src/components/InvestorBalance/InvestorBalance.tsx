import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { useAccount } from '@/hooks/account';
import { useGetFrozenTokens } from '@/hooks/getFrozenTokens';
import { getBalance } from '@/services/getBalance';
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
  const { data: frozenData } = useGetFrozenTokens({ investorAccount });
  const [isMounted, setIsMounted] = useState(false);

  const init = async (account: IWalletAccount, investorAccount: string) => {
    if (!account || !investorAccount || isMounted) return;
    const res = await getBalance({ investorAccount, account: account! });

    if (typeof res === 'number') {
      setData(res);
    }

    setIsMounted(true);
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
