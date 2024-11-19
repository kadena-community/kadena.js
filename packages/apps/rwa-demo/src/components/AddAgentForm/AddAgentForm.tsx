import { useAccount } from '@/hooks/account';
import { useTransactions } from '@/hooks/transactions';
import type { IAddAgentProps } from '@/services/addAgent';
import { addAgent } from '@/services/addAgent';
import { getClient } from '@/utils/client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  TextField,
} from '@kadena/kode-ui';
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
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const [openModal, setOpenModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<IAddAgentProps>({
    defaultValues: {
      agent: '',
    },
  });

  const onSubmit = async (data: IAddAgentProps) => {
    setError(null);
    try {
      const tx = await addAgent(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      addTransaction({
        ...res,
        type: 'ADDAGENT',
        data: { ...res, ...data },
      });
      console.log('DONE');
    } catch (e: any) {
      setError(e?.message || e);
    }

    onClose();
  };

  return (
    <>
      <Dialog
        isOpen={openModal}
        onOpenChange={() => {
          setOpenModal(false);
        }}
      >
        <DialogHeader>Transaction</DialogHeader>
        <DialogContent>df</DialogContent>
      </Dialog>

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
    </>
  );
};
