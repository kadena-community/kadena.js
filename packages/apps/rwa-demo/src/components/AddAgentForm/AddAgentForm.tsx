import { useAccount } from '@/hooks/account';
import { useNetwork } from '@/hooks/networks';
import type { IAddAgentProps } from '@/services/addAgent';
import { addAgent } from '@/services/addAgent';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface IProps {
  onClose: () => void;
}

export const AddAgentForm: FC<IProps> = ({ onClose }) => {
  const { activeNetwork } = useNetwork();
  const { account } = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<IAddAgentProps>({
    defaultValues: {
      agent: '',
    },
  });

  const onSubmit = async (data: IAddAgentProps) => {
    console.log({ data });
    setError(null);
    try {
      await addAgent(data, activeNetwork, account!);

      // setIsRightAsideExpanded(false);
    } catch (e: any) {
      setError(e?.message || e);
    }

    // onClose();
  };

  return (
    <RightAside isOpen onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RightAsideHeader label="Add Agent" />
        <RightAsideContent>
          <TextField
            label="Agent Account"
            {...register('agent', { required: true })}
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
  );
};
