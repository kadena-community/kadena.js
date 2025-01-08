import { useBatchFreezeInvestors } from '@/hooks/batchFreezeInvestors';
import type { IBatchSetAddressFrozenProps } from '@/services/batchSetAddressFrozen';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  TextareaField,
} from '@kadena/kode-ui';

import { useAccount } from '@/hooks/account';
import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import type { UseFormHandleSubmit, UseFormReset } from 'react-hook-form';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';

interface IProps {
  pause: boolean;
  isDisabled: boolean;
  handleReset: UseFormReset<{
    select: [];
    message: string;
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      select: [];
      message: string;
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { account } = useAccount();
  const { submit, isAllowed } = useBatchFreezeInvestors();

  const onSubmit = async ({ select }: { select: string[] }) => {
    const data: IBatchSetAddressFrozenProps = {
      investorAccounts: select,
      pause,
      message,
    };
    const tx = await submit(data);
    setIsModalOpen(false);
    tx?.listener.subscribe(
      () => {},
      () => {},
      () => {
        handleReset({ select: [] });
      },
    );
  };

  const handleMessageChange = (e: ChangeEvent) => {
    setMessage((e.target as HTMLTextAreaElement).value);
  };

  const handleStart = async () => {
    if (pause) {
      setIsModalOpen(true);
      return;
    }
  };

  return (
    <>
      {pause && (
        <Dialog isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
          <DialogHeader>Freeze selected accounts</DialogHeader>
          <DialogContent>
            <TextareaField
              onChange={handleMessageChange}
              label="message"
              maxLength={100}
              rows={5}
            />
          </DialogContent>
          <DialogFooter>
            <Button variant="outlined" onPress={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              isDisabled={isDisabled || !isAllowed}
              variant="primary"
            >
              Freeze
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      <Button
        isDisabled={isDisabled || !isAllowed}
        onClick={pause ? handleStart : handleSubmit(onSubmit)}
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
    </>
  );
};
