import { useFreeze } from '@/hooks/freeze';
import { useFreezeInvestor } from '@/hooks/freezeInvestor';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import type { IButtonProps } from '@kadena/kode-ui';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogHeaderSubtitle,
  maskValue,
  Text,
  TextareaField,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { frozen } = useFreeze({ investorAccount });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { submit, isAllowed } = useFreezeInvestor();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<{ message: string }>({
    values: {
      message: '',
    },
  });

  const handleFreeze = async (data?: { message: string }) => {
    if (frozen === undefined) return;

    const newData = {
      investorAccount: investorAccount,
      pause: !frozen,
      message: data?.message,
    };
    try {
      setIsLoading(true);
      return await submit(newData);
    } catch (e: any) {
      setIsLoading(false);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleStart = async () => {
    if (frozen === undefined || frozen === false) {
      setIsModalOpen(true);
      return;
    }

    await handleFreeze();
  };

  useEffect(() => {
    setIsLoading(false);
  }, [frozen]);

  const label = iconOnly ? '' : frozen ? 'Unfreeze account' : 'Freeze account';

  return (
    <>
      <Dialog isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit(handleFreeze)}>
          <DialogHeader>Freeze the account</DialogHeader>
          <DialogHeaderSubtitle>
            <Text variant="code">{maskValue(investorAccount)}</Text>
          </DialogHeaderSubtitle>
          <DialogContent>
            <TextareaField
              label="message"
              {...register('message', {
                required: false,
                maxLength: 100,
              })}
              rows={5}
            />
          </DialogContent>
          <DialogFooter>
            <Button variant="outlined" onPress={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={!isValid || !isAllowed}
              variant="primary"
            >
              Freeze
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
      <SendTransactionAnimation
        onPress={handleStart}
        trigger={
          <Button
            startVisual={
              <TransactionTypeSpinner
                type={TXTYPES.FREEZEINVESTOR}
                account={investorAccount}
                fallbackIcon={getVisual(frozen, isLoading)}
              />
            }
            isDisabled={!isAllowed}
            isCompact={isCompact}
            variant={variant}
          >
            {label}
          </Button>
        }
      ></SendTransactionAnimation>
    </>
  );
};
