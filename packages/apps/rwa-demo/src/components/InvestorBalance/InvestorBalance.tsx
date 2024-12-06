import { useAccount } from '@/hooks/account';
import { getBalance } from '@/services/getBalance';
import { getFrozenTokens } from '@/services/getFrozenTokens';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

interface IProps {
  investorAccount: string;
}

export const InvestorBalance: FC<IProps> = ({ investorAccount }) => {
  const { account } = useAccount();
  const [data, setData] = useState(0);
  const [frozenData, setFrozenData] = useState(0);

  const init = async () => {
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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  return (
    <Stack>
      investorBalance: {data} (frozen: {frozenData})
    </Stack>
  );
};
