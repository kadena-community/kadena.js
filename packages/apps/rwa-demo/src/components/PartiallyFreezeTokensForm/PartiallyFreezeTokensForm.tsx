import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { useGetFrozenTokens } from '@/hooks/getFrozenTokens';
import { useGetInvestorBalance } from '@/hooks/getInvestorBalance';
import { useTogglePartiallyFreezeTokens } from '@/hooks/togglePartiallyFreezeTokens';
import type { ITogglePartiallyFreezeTokensProps } from '@/services/togglePartiallyFreezeTokens';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AssetPausedMessage } from '../AssetPausedMessage/AssetPausedMessage';
import { InvestorFrozenMessage } from '../InvestorFrozenMessage/InvestorFrozenMessage';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';

interface IProps {
  onClose?: () => void;
  investorAccount: string;
  trigger: ReactElement;
}

export const PartiallyFreezeTokensForm: FC<IProps> = ({
  onClose,
  investorAccount,
  trigger,
}) => {
  const { data: balance } = useGetInvestorBalance({
    investorAccount,
  });
  const [tx, setTx] = useState<ITransaction>();
  const resolveRef = useRef<Function | null>(null);

  const { data: frozenData } = useGetFrozenTokens({ investorAccount });
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();

  const { submit, isAllowed: isPartiallyFreezeTokensAllowed } =
    useTogglePartiallyFreezeTokens({
      investorAccount,
    });
  const {
    handleSubmit,
    formState: { isValid, errors },
    control,
  } = useForm<ITogglePartiallyFreezeTokensProps>({
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

  const onSubmit = async (data: ITogglePartiallyFreezeTokensProps) => {
    const freeze = parseInt(data.amount) >= 0;

    const transaction = await submit({
      ...data,
      amount: `${Math.abs(parseInt(data.amount))}`,
      freeze,
    });
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

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Partially Freeze Tokens" />
            <RightAsideContent>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: true,
                  min: -frozenData,
                  max: balance - frozenData,
                }}
                render={({ field }) => (
                  <TextField
                    label="Amount"
                    {...field}
                    errorMessage={errors.amount?.message}
                    description={`max amount: ${balance - frozenData} | min amount: ${-frozenData}`}
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
                  <Button
                    isDisabled={!isPartiallyFreezeTokensAllowed || !isValid}
                    type="submit"
                  >
                    Freeze / UnFreeze
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
