import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
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
  Stack,
  Text,
  TextareaField,
} from '@kadena/kode-ui';
import type { Attributes, FC, ReactElement } from 'react';
import React, { cloneElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { complianceWrapperClass } from '../Confirmation/style.css';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';

interface IProps {
  investorAccount: string;
  isCompact?: IButtonProps['isCompact'];
  variant?: IButtonProps['variant'];
  iconOnly?: boolean;
  trigger?: ReactElement<
    Partial<IButtonProps> &
      Attributes & {
        icon: ReactElement;
        onPress?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
      }
  >;
}

const getVisual = (frozen: boolean, isLoading: boolean) => {
  if (isLoading) {
    return <TransactionPendingIcon />;
  }
  return (
    <Stack data-frozenState={frozen}>
      {frozen ? <MonoPause /> : <MonoPlayArrow />}
    </Stack>
  );
};

export const FreezeInvestor: FC<IProps> = ({
  investorAccount,
  iconOnly,
  isCompact,
  variant,
  trigger,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { frozen } = useFreeze({ investorAccount });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { submit, isAllowed } = useFreezeInvestor();

  const { register, handleSubmit } = useForm<{ message: string }>({
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
  const IconVisual = () => (
    <TransactionTypeSpinner
      type={TXTYPES.FREEZEINVESTOR}
      account={investorAccount}
      fallbackIcon={getVisual(frozen, isLoading)}
    />
  );

  return (
    <>
      <Stack className={complianceWrapperClass}>
        <Dialog isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit(handleFreeze)} style={{ width: '100%' }}>
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
              <Button type="submit" isDisabled={!isAllowed} variant="primary">
                Freeze
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </Stack>
      <SendTransactionAnimation
        onPress={handleStart}
        trigger={
          trigger ? (
            cloneElement(trigger, {
              ...trigger.props,
              icon: <IconVisual />,
              startVisual: <IconVisual />,
              isDisabled: !isAllowed,
              isCompact,
              variant,
              children: label,
            })
          ) : (
            <></>
          )
        }
      ></SendTransactionAnimation>
    </>
  );
};
