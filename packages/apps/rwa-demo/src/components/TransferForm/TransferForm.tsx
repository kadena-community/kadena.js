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
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  onClose: () => void;
  investorAccount: string;
}

export const TransferForm: FC<IProps> = ({ onClose, investorAccount }) => {
  const { data: investors } = useGetInvestors();
  const { submit } = useTransferTokens();

  const { register, control, handleSubmit } = useForm<ITransferTokensProps>({
    values: {
      amount: 0,
      investorFromAccount: investorAccount,
      investorToAccount: '',
    },
  });

  const onSubmit = async (data: ITransferTokensProps) => {
    console.log(1111, { data });
    await submit(data);

    onClose();
  };

  const filteredInvestors = investors.filter(
    (i) => i.accountName !== investorAccount,
  );

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Transfer Tokens" />
          <RightAsideContent>
            <TextField
              label="Amount"
              type="number"
              {...register('amount', { required: true })}
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
                  onSelectionChange={field.onChange}
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
