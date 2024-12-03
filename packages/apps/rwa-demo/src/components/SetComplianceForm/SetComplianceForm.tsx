import { useAccount } from '@/hooks/account';
import { useSetCompliance } from '@/hooks/setCompliance';
import type { ISetComplianceProps } from '@/services/setCompliance';
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

export const SetComplianceForm: FC<IProps> = ({ onClose }) => {
  const { isComplianceOwner } = useAccount();
  const { submit } = useSetCompliance();
  const { register, handleSubmit } = useForm<ISetComplianceProps>({
    defaultValues: {
      maxBalance: 0,
      maxSupply: 0,
    },
  });

  const onSubmit = async (data: ISetComplianceProps) => {
    await submit(data);

    onClose();
  };

  if (!isComplianceOwner) return null;

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Set compliance" />
          <RightAsideContent>
            <TextField
              type="number"
              label="Max Balance"
              {...register('maxBalance', { required: true })}
            />
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
            <Button type="submit">Set Compliance</Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
