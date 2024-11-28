import { useAddInvestor } from '@/hooks/addInvestor';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
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

export const AddInvestorForm: FC<IProps> = ({ onClose }) => {
  const { submit } = useAddInvestor();
  const { register, handleSubmit } = useForm<IRegisterIdentityProps>({
    defaultValues: {
      accountName: '',
    },
  });

  const onSubmit = async (data: IRegisterIdentityProps) => {
    await submit(data);
    onClose();
  };

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Add Investor" />
          <RightAsideContent>
            <TextField
              label="Investor Account"
              {...register('accountName', { required: true })}
            />
          </RightAsideContent>
          <RightAsideFooter>
            <Button onPress={onClose} variant="transparent">
              Cancel
            </Button>
            <Button type="submit">Add Investor</Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
