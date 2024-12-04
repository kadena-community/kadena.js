import { useAccount } from '@/hooks/account';
import { useSetMaxSupply } from '@/hooks/setMaxSupply';
import type { ISetMaxSupplyProps } from '@/services/setMaxSupply';
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

export const SetMaxSupplyForm: FC<IProps> = ({ onClose }) => {
  const { isComplianceOwner } = useAccount();
  const { submit } = useSetMaxSupply();
  const { register, handleSubmit } = useForm<ISetMaxSupplyProps>({
    defaultValues: {
      maxSupply: 0,
    },
  });

  const onSubmit = async (data: ISetMaxSupplyProps) => {
    await submit(data);

    onClose();
  };

  if (!isComplianceOwner) return null;

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Set max supply for investor" />
          <RightAsideContent>
            <TextField
              type="number"
              label="Max Supply"
              {...register('maxSupply', { required: true })}
            />
          </RightAsideContent>
          <RightAsideFooter>
            <Button onPress={onClose} variant="transparent">
              Cancel
            </Button>
            <Button type="submit">Set Max Supply</Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
