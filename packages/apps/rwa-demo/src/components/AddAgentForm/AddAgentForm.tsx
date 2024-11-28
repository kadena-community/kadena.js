import { useAddAgent } from '@/hooks/addAgent';
import type { IAddAgentProps } from '@/services/addAgent';
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

export const AddAgentForm: FC<IProps> = ({ onClose }) => {
  const { submit } = useAddAgent();
  const { register, handleSubmit } = useForm<IAddAgentProps>({
    defaultValues: {
      accountName: '',
    },
  });

  const onSubmit = async (data: IAddAgentProps) => {
    await submit(data);
    onClose();
  };

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Add Agent" />
          <RightAsideContent>
            <TextField
              label="Agent Account"
              {...register('accountName', { required: true })}
            />
          </RightAsideContent>
          <RightAsideFooter>
            <Button onPress={onClose} variant="transparent">
              Cancel
            </Button>
            <Button type="submit">Add Agent</Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
