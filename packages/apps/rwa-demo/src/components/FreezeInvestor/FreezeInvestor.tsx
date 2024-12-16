import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useFreeze } from '@/hooks/freeze';
import { useFreezeInvestor } from '@/hooks/freezeInvestor';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import type { IButtonProps } from '@kadena/kode-ui';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

interface IProps {
  investorAccount: string;
  isCompact?: IButtonProps['isCompact'];
  variant?: IButtonProps['variant'];
  iconOnly?: boolean;
}

const getVisual = (frozen: boolean, isLoading: boolean) => {
  if (isLoading) {
    return <TransactionPendingIcon />;
  }
  return frozen ? <MonoPause /> : <MonoPlayArrow />;
};

export const FreezeInvestor: FC<IProps> = ({
  investorAccount,
  iconOnly,
  isCompact,
  variant,
}) => {
  const { accountRoles } = useAccount();
  const { paused } = useAsset();
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

  const label = iconOnly ? '' : frozen ? 'Unfreeze account' : 'Freeze account';

  return (
    <SendTransactionAnimation
      onPress={handleFreeze}
      trigger={
        <Button
          startVisual={getVisual(frozen, isLoading)}
          isDisabled={paused || !accountRoles.isFreezer()}
          isCompact={isCompact}
          variant={variant}
        >
          {label}
        </Button>
      }
    ></SendTransactionAnimation>
  );
};
