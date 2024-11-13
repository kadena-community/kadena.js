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

interface ISecurityFormProps {
  name: string;
  symbol: string;
  kadenaId: string;
}

export const SecurityForm: FC = () => {
  const { setIsRightAsideExpanded } = useLayout();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<ISecurityFormProps>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: ISecurityFormProps) => {
    const { name } = data;
    setError(null);
    try {
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
