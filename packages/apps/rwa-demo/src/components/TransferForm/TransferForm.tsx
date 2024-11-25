import { useAccount } from '@/hooks/account';
import { useGetInvestors } from '@/hooks/getInvestors';
import { useTransferTokens } from '@/hooks/transferTokens';
import type { ITransferTokensProps } from '@/services/transferTokens';
import { Button, Select, SelectItem, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  onClose: () => void;
}

export const TransferForm: FC<IProps> = ({ onClose }) => {
  const [balance, setBalance] = useState(0);
  const { account, getBalance } = useAccount();
  const { data: investors } = useGetInvestors();
  const { submit } = useTransferTokens();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ITransferTokensProps>({
    values: {
      amount: 0,
      investorFromAccount: account?.address!,
      investorToAccount: '',
    },
  });

  const onSubmit = async (data: ITransferTokensProps) => {
    await submit(data);
    onClose();
  };

  const filteredInvestors = investors.filter(
    (i) => i.accountName !== account?.address,
  );

  const init = async () => {
    const res = await getBalance();
    setBalance(res);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  if (!account) return;

  console.log({ errors });
  return (
    <>
      <RightAside isOpen onClose={onClose}>
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
              variant={!!errors.amount?.message ? 'negative' : 'default'}
              description={`max amount tokens: ${balance}`}
              errorMessage={errors.amount?.message}
            />

            <Controller
              name="investorToAccount"
              control={control}
              render={({ field }) => (
                <Select
                  label="Select an option"
                  items={filteredInvestors}
                  selectedKey={field.value}
                  variant={
                    !!errors.investorToAccount?.message ? 'negative' : 'default'
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

          <RightAsideFooter>
            <Button onPress={onClose} variant="transparent">
              Cancel
            </Button>
            <Button type="submit">Transfer</Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
