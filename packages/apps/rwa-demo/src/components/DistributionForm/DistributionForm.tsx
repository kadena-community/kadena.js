import { useDistributeTokens } from '@/hooks/distributeTokens';
import type { IDistributeTokensProps } from '@/services/distributeTokens';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

interface IProps {
  onClose: () => void;
  investorAccount: string;
}

export const DistributionForm: FC<IProps> = ({ onClose, investorAccount }) => {
  const { submit } = useDistributeTokens();
  const { register, handleSubmit } = useForm<IDistributeTokensProps>({
    values: {
      amount: 0,
      investorAccount,
    },
  });

  const onSubmit = async (data: IDistributeTokensProps) => {
    await submit(data);

    onClose();
  };

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Distribute Tokens" />
          <RightAsideContent>
            <TextField
              label="Amount"
              type="number"
              {...register('amount', { required: true })}
            />
          </RightAsideContent>
          <RightAsideFooter>
            <Button onPress={onClose} variant="transparent">
              Cancel
            </Button>
            <Button type="submit">Distribute</Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
