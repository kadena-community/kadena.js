import { useBatchFreezeInvestors } from '@/hooks/batchFreezeInvestors';
import type { IBatchSetAddressFrozenProps } from '@/services/batchSetAddressFrozen';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';

import { useAccount } from '@/hooks/account';
import type { FC } from 'react';
import type { UseFormHandleSubmit, UseFormReset } from 'react-hook-form';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';

interface IProps {
  pause: boolean;
  isDisabled: boolean;
  handleReset: UseFormReset<{
    select: [];
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      select: [];
    },
    undefined
  >;
}

export const BadgeFreezeForm: FC<IProps> = ({
  handleSubmit,
  handleReset,
  isDisabled,
  pause,
}) => {
  const { account } = useAccount();
  const { submit, isAllowed } = useBatchFreezeInvestors();

  const onSubmit = async ({ select }: { select: string[] }) => {
    const data: IBatchSetAddressFrozenProps = {
      investorAccounts: select,
      pause,
    };
    const tx = await submit(data);
    tx?.listener.subscribe(
      () => {},
      () => {},
      () => {
        handleReset({ select: [] });
      },
    );
  };

  return (
    <Button
      isDisabled={isDisabled || !isAllowed}
      onClick={handleSubmit(onSubmit)}
      isCompact
      variant="outlined"
      endVisual={
        <TransactionTypeSpinner
          type={[TXTYPES.FREEZEINVESTOR]}
          account={account?.address}
          fallbackIcon={pause ? <MonoPlayArrow /> : <MonoPause />}
        />
      }
    >
      {pause ? 'Freeze' : 'Unfreeze'}
    </Button>
  );
};
