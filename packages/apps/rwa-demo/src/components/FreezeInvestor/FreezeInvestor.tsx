import { useAccount } from '@/hooks/account';
import { useTransactions } from '@/hooks/transactions';
import { isFrozen } from '@/services/isFrozen';
import { setAddressFrozen } from '@/services/setAddressFrozen';
import { getClient } from '@/utils/client';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

interface IProps {
  investorAccount: string;
  onChanged: (paused: boolean) => void;
}

const getVisual = (paused?: boolean) => {
  if (typeof paused !== 'boolean') {
    return <TransactionPendingIcon />;
  }
  return paused ? <MonoPause /> : <MonoPlayArrow />;
};

export const FreezeInvestor: FC<IProps> = ({ investorAccount, onChanged }) => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const [frozen, setFrozen] = useState<boolean | undefined>();
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

      const transaction = addTransaction({
        ...res,
        type: 'FREEZE-ADDRESS',
        data: {
          ...res,
          ...data,
        },
      });

      await transaction.listener;
      setFrozen(undefined);
    } catch (e: any) {}
  };

  const fetchData = async () => {
    const res = await isFrozen({
      investorAccount: investorAccount,
      account: account!,
    });

    if (typeof res === 'boolean') {
      setFrozen(res);
      onChanged(res);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchData();
    }
  }, [frozen]);

  return (
    <Button startVisual={getVisual(frozen)} onPress={handleFreeze}>
      Pause Account
    </Button>
  );
};
