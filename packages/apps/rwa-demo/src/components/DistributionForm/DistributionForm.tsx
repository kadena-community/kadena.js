import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useDistributeTokens } from '@/hooks/distributeTokens';
import type { IDistributeTokensProps } from '@/services/distributeTokens';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AssetPausedMessage } from '../AssetPausedMessage/AssetPausedMessage';
import { InvestorFrozenMessage } from '../InvestorFrozenMessage/InvestorFrozenMessage';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
import type { ITransaction } from '../TransactionsProvider/TransactionsProvider';

interface IProps {
  onClose?: () => void;
  investorAccount: string;
  trigger: ReactElement;
}

export const DistributionForm: FC<IProps> = ({
  onClose,
  investorAccount,
  trigger,
}) => {
  const { balance } = useAccount();
  const { asset } = useAsset();
  const [tx, setTx] = useState<ITransaction>();
  const resolveRef = useRef<Function | null>(null);
  const { submit, isAllowed } = useDistributeTokens({ investorAccount });
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<IDistributeTokensProps>({
    values: {
      amount: '0',
      investorAccount,
    },
  });

  const handleOpen = () => {
    setIsRightAsideExpanded(true);
    setIsOpen(true);
    if (trigger.props.onPress) trigger.props.onPress();
  };

  const handleOnClose = () => {
    setIsRightAsideExpanded(false);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const onSubmit = async (data: IDistributeTokensProps) => {
    const transaction = await submit(data);
    setTx(transaction);

    return transaction;
  };

  useEffect(() => {
    if (tx && resolveRef.current) {
      resolveRef.current(tx);
      handleOnClose();
    }
  }, [tx]);

  const waitForStateChange = () => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handlePress = async () => {
    const message = await waitForStateChange();
    return message;
  };

  const maxAmount = (asset?.maxBalance ?? 0) - balance;
  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Distribute Tokens" />
            <RightAsideContent>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: true,
                  min: 0,
                  max: maxAmount >= 0 ? maxAmount : undefined,
                }}
                render={({ field }) => (
                  <TextField
                    type="number"
                    label="Amount"
                    {...field}
                    errorMessage={errors.amount?.message}
                    description={
                      maxAmount >= 0 ? `max amount: ${maxAmount}` : ''
                    }
                  />
                )}
              />
            </RightAsideContent>
            <RightAsideFooter
              message={
                <>
                  <InvestorFrozenMessage investorAccount={investorAccount} />
                  <AssetPausedMessage />
                </>
              }
            >
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <SendTransactionAnimation
                onPress={handlePress}
                trigger={
                  <Button isDisabled={!isAllowed || !isValid} type="submit">
                    Distribute
                  </Button>
                }
              />
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
