import { useAccount } from '@/hooks/account';
import { useNetwork } from '@/hooks/networks';
import type { ISetComplianceProps } from '@/services/setCompliance';
import { setCompliance } from '@/services/setCompliance';
import { getClient } from '@/utils/client';
import { Button, NumberField } from '@kadena/kode-ui';
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

export const SetComplianceForm: FC<IProps> = ({ onClose }) => {
  const { activeNetwork } = useNetwork();
  const { account, sign } = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<ISetComplianceProps>({
    defaultValues: {
      maxBalance: 0,
      maxSupply: 0,
    },
  });

  const onSubmit = async (data: ISetComplianceProps) => {
    setError(null);
    try {
      const tx = await setCompliance(data, activeNetwork, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await client.listen(res);
      console.log('DONE');
    } catch (e: any) {
      setError(e?.message || e);
    }
    onClose();
  };

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Set compliance" />
          <RightAsideContent>
            <NumberField
              label="Max Balance"
              {...register('maxBalance', { required: true })}
            />
            <NumberField
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
