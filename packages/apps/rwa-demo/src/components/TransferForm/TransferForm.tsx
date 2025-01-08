import { useAccount } from '@/hooks/account';
import { useGetFrozenTokens } from '@/hooks/getFrozenTokens';
import { useGetInvestorBalance } from '@/hooks/getInvestorBalance';
import { useGetInvestors } from '@/hooks/getInvestors';
import { useTransferTokens } from '@/hooks/transferTokens';
import type { ITransferTokensProps } from '@/services/transferTokens';
import {
  Button,
  Notification,
  NotificationHeading,
  Select,
  SelectItem,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AssetPausedMessage } from '../AssetPausedMessage/AssetPausedMessage';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
  isForced?: boolean;
  investorAccount: string;
}

export const TransferForm: FC<IProps> = ({
  onClose,
  trigger,
  isForced = false,
  investorAccount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { account } = useAccount();
  const { data: balance } = useGetInvestorBalance({ investorAccount });
  const { data: investors } = useGetInvestors();
  const { submit, isAllowed } = useTransferTokens();
  const { data: frozenAmount } = useGetFrozenTokens({
    investorAccount: investorAccount,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<ITransferTokensProps>({
    values: {
      amount: 0,
      investorFromAccount: account?.address!,
      investorToAccount: '',
      isForced,
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

  const onSubmit = async (data: ITransferTokensProps) => {
    await submit(data);
    handleOnClose();
  };

  const filteredInvestors = investors.filter(
    (i) => i.accountName !== account?.address,
  );

  if (!account) return;

  const maxAmount = isForced ? balance : balance - frozenAmount;

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Transfer Tokens" />
            <RightAsideContent>
              {isForced && (
                <Stack width="100%" marginBlockEnd="md">
                  <Notification role="status" intent="warning">
                    <NotificationHeading>Warning</NotificationHeading>
                    This is a forced transfer (partial frozen tokens can also be
                    transfered)
                  </Notification>
                </Stack>
              )}
              <input type="hidden" {...register('isForced', {})} />
              <TextField
                label="Amount"
                type="number"
                {...register('amount', {
                  required: {
                    value: true,
                    message: 'This field is required',
                  },
                  min: {
                    value: 1,
                    message: 'The value should be at least 1',
                  },
                  max: {
                    value: maxAmount,
                    message:
                      'The value can not be more than your balance ( - frozen tokens)',
                  },
                })}
                variant={errors.amount?.message ? 'negative' : 'default'}
                description={`max amount tokens: ${maxAmount}`}
                errorMessage={errors.amount?.message}
              />

              <Controller
                name="investorToAccount"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    label="Select an option"
                    items={filteredInvestors}
                    selectedKey={field.value}
                    variant={
                      errors.investorToAccount?.message ? 'negative' : 'default'
                    }
                    onSelectionChange={field.onChange}
                    errorMessage={errors.investorToAccount?.message}
                  >
                    {(item) => (
                      <SelectItem key={item.accountName}>
                        {item.accountName}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
            </RightAsideContent>

            <RightAsideFooter message={<AssetPausedMessage />}>
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <Button isDisabled={!isAllowed || !isValid} type="submit">
                Transfer
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}
      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
