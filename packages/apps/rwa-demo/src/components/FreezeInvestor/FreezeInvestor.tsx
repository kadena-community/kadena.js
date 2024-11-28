import { useFreeze } from '@/hooks/freeze';
import { useFreezeInvestor } from '@/hooks/freezeInvestor';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
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
  const { frozen } = useFreeze({ investorAccount });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { submit } = useFreezeInvestor();

  const handleFreeze = async () => {
    if (frozen === undefined) return;

    const data = {
      investorAccount: investorAccount,
      pause: !frozen,
    };
    try {
      setIsLoading(true);
      return await submit(data);
    } catch (e: any) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [frozen]);

  return (
    <SendTransactionAnimation
      onPress={handleFreeze}
      trigger={
        <Button startVisual={getVisual(frozen, isLoading)}>
          {frozen ? 'Unfreeze account' : 'Freeze account'}
        </Button>
      }
    ></SendTransactionAnimation>
  );
};
