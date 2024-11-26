import { useAccount } from '@/hooks/account';
import { useFreeze } from '@/hooks/freeze';
import { useTransactions } from '@/hooks/transactions';
import { setAddressFrozen } from '@/services/setAddressFrozen';
import { getClient } from '@/utils/client';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

interface IProps {
  investorAccount: string;
}

const getVisual = (frozen: boolean, isLoading: boolean) => {
  if (isLoading) {
    return <TransactionPendingIcon />;
  }
  return frozen ? <MonoPause /> : <MonoPlayArrow />;
};

export const FreezeInvestor: FC<IProps> = ({ investorAccount }) => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { frozen } = useFreeze({ investorAccount });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFreeze = async () => {
    if (frozen === undefined) return;

    const data = {
      investorAccount: investorAccount,
      agentAccount: account!,
      pause: !frozen,
    };
    try {
      setIsLoading(true);
      const tx = await setAddressFrozen(data);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      addTransaction({
        ...res,
        type: 'FREEZE-ADDRESS',
        data: {
          ...res,
          ...data,
        },
      });
    } catch (e: any) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [frozen]);

  return (
    <Button startVisual={getVisual(frozen, isLoading)} onPress={handleFreeze}>
      Pause Account
    </Button>
  );
};
