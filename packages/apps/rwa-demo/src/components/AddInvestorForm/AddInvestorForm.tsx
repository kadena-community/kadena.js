import { useAccount } from '@/hooks/account';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import { registerIdentity } from '@/services/registerIdentity';
import { getClient } from '@/utils/client';
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

export const AddInvestorForm: FC<IProps> = ({ onClose }) => {
  const { account, sign } = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<IRegisterIdentityProps>({
    defaultValues: {
      investor: '',
    },
  });

  const onSubmit = async (data: IRegisterIdentityProps) => {
    const newData: IRegisterIdentityProps = { ...data, agent: account! };
    setError(null);
    //try {
    const tx = await registerIdentity(newData);
    console.log(tx);
    const signedTransaction = await sign(tx);
    if (!signedTransaction) return;

    const client = getClient();
    const res = await client.submit(signedTransaction);
    console.log(res);

    await client.listen(res);
    console.log('DONE');
    // } catch (e: any) {
    //   setError(e?.message || e);
    // }

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
              {...register('investor', { required: true })}
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
