import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { useAsset } from '@/hooks/asset';
import { useDistributeTokens } from '@/hooks/distributeTokens';
import { useGetInvestorBalance } from '@/hooks/getInvestorBalance';
import type { IDistributeTokensProps } from '@/services/distributeTokens';
import { Button, Stack, TextField } from '@kadena/kode-ui';
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
import { AccountNameField } from '../Fields/AccountNameField';
import { InvestorFrozenMessage } from '../InvestorFrozenMessage/InvestorFrozenMessage';
import { MaxSupplyMessage } from '../MaxSupplyMessage/MaxSupplyMessage';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
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
  const { maxCompliance, asset } = useAsset();
  const { data: balance } = useGetInvestorBalance({
    investorAccount,
  });
  const [tx, setTx] = useState<ITransaction>();
  const resolveRef = useRef<Function | null>(null);
  const { submit, isAllowed } = useDistributeTokens({ investorAccount });
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<IDistributeTokensProps>({
    mode: 'onChange',
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

  const maxBalance = maxCompliance('max-balance-compliance-v1');
  const maxSupply = maxCompliance('supply-limit-compliance-v1');
  const supply = asset?.supply ?? 0;

  let maxAmount = -1;
  if (maxBalance >= 0) {
    maxAmount = maxBalance - balance;
  }
  if (maxSupply >= 0 && maxAmount < maxSupply - supply) {
    maxAmount = maxSupply - supply;
  }

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Distribute Tokens" />
            <RightAsideContent>
              <Stack flexDirection="column" gap="md">
                <AccountNameField
                  name="investorAccount"
                  label="Distribute Account"
                  control={control}
                  value={investorAccount}
                  accountName={investorAccount}
                />
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: true,
                    min: {
                      value: 0,
                      message: 'Amount must be greater than or equal to 0',
                    },
                    max: {
                      value: maxAmount >= 0 ? maxAmount : Infinity,
                      message: `Amount must be less than or equal to ${maxAmount >= 0 ? maxAmount : 'unlimited'}`,
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      type="number"
                      label="Amount"
                      {...field}
                      isInvalid={!!errors.amount}
                      errorMessage={errors.amount?.message}
                      description={
                        maxAmount >= 0 ? `max amount: ${maxAmount}` : ''
                      }
                    />
                  )}
                />
              </Stack>
            </RightAsideContent>
            <RightAsideFooter
              message={
                <>
                  <InvestorFrozenMessage investorAccount={investorAccount} />
                  <AssetPausedMessage />
                  <MaxSupplyMessage />
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
