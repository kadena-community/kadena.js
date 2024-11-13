import { useAccount } from '@/hooks/account';
import { useNetwork } from '@/hooks/networks';
import { createToken } from '@/services/createToken';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface ISecurityFormProps {
  name: string;
  symbol: string;
  kadenaId: string;
}

export const SecurityForm: FC = () => {
  const { setIsRightAsideExpanded } = useLayout();
  const { activeNetwork } = useNetwork();
  const { account } = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<ISecurityFormProps>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: ISecurityFormProps) => {
    console.log({ data });
    setError(null);
    try {
      await createToken(data, activeNetwork, account!);

      // setIsRightAsideExpanded(false);
    } catch (e: any) {
      setError(e?.message || e);
    }
  };

  return (
    <RightAside isOpen>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RightAsideHeader label="Create New Security" />
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
          <Button
            onPress={() => setIsRightAsideExpanded(false)}
            variant="transparent"
          >
            Cancel
          </Button>
          <Button type="submit">Create Security</Button>
        </RightAsideFooter>
      </form>
    </RightAside>
  );
};
