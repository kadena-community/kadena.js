import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useGetInvestors } from '@/hooks/getInvestors';
import { useTransferTokens } from '@/hooks/transferTokens';
import type { ITransferTokensProps } from '@/services/transferTokens';
import { Button, Select, SelectItem, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AssetPausedMessage } from '../AssetPausedMessage/AssetPausedMessage';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
}

export const TransferForm: FC<IProps> = ({ onClose, trigger }) => {
  const { paused } = useAsset();
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [balance, setBalance] = useState(0);
  const { account, getBalance } = useAccount();
  const { data: investors } = useGetInvestors();
  const { submit } = useTransferTokens();

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

  const init = async () => {
    if (!account) return;
    const res = await getBalance();
    setBalance(res);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [account?.address]);

  if (!account) return;

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Transfer Tokens" />
            <RightAsideContent>
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
                    value: balance,
                    message: 'The value can not be more than your balance',
                  },
                })}
                variant={errors.amount?.message ? 'negative' : 'default'}
                description={`max amount tokens: ${balance}`}
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
              <Button isDisabled={paused || !isValid} type="submit">
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
