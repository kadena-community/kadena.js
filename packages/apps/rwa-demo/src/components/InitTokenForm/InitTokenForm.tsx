import { useAccount } from '@/hooks/account';
import { useNetwork } from '@/hooks/networks';
import type { IInitTokenProps } from '@/services/initToken';
import { initToken } from '@/services/initToken';
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

export const InitTokenForm: FC<IProps> = ({ onClose }) => {
  const { activeNetwork } = useNetwork();
  const { account } = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<IInitTokenProps>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: IInitTokenProps) => {
    console.log({ data });
    setError(null);
    //try {
    await initToken(data, activeNetwork, account!);

    //onClose();
    // setIsRightAsideExpanded(false);
    // } catch (e: any) {
    //   setError(e?.message || e);
    // }
  };

  return (
    <RightAside isOpen onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RightAsideHeader label="Init Asset" />
        <RightAsideContent>
          <TextField label="Name" {...register('name', { required: true })} />
          <TextField
            label="Symbol"
            {...register('symbol', { required: true })}
          />
          <TextField
            label="KadenaId"
            {...register('kadenaId', { required: true })}
          />
        </RightAsideContent>
        <RightAsideFooter>
          <Button onPress={onClose} variant="transparent">
            Cancel
          </Button>
          <Button type="submit">Create Security</Button>
        </RightAsideFooter>
      </form>
    </RightAside>
  );
};
