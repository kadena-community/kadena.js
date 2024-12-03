import { useAccount } from '@/hooks/account';
import { useSetMaxBalance } from '@/hooks/setMaxBalance';
import type { ISetMaxBalanceProps } from '@/services/setMaxBalance';
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
}

export const SetMaxBalanceForm: FC<IProps> = ({ onClose }) => {
  const { isComplianceOwner } = useAccount();
  const { submit } = useSetMaxBalance();
  const { register, handleSubmit } = useForm<ISetMaxBalanceProps>({
    defaultValues: {
      maxBalance: 0,
    },
  });

  const onSubmit = async (data: ISetMaxBalanceProps) => {
    await submit(data);

    onClose();
  };

  if (!isComplianceOwner) return null;

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Set Max Balance" />
          <RightAsideContent>
            <TextField
              type="number"
              label="Max Balance"
              {...register('maxBalance', { required: true })}
            />
          </RightAsideContent>
          <RightAsideFooter>
            <Button onPress={onClose} variant="transparent">
              Cancel
            </Button>
            <Button type="submit">Set Max Balance</Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
