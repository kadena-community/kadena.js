import { useAccount } from '@/hooks/account';
import { useGetInvestors } from '@/hooks/getInvestors';
import { useTransferTokens } from '@/hooks/transferTokens';
import type { ITransferTokensProps } from '@/services/transferTokens';
import type { IUnsignedCommand } from '@kadena/client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Select,
  SelectItem,
  TextareaField,
  TextField,
} from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  onClose: () => void;
}

export const TransferForm: FC<IProps> = ({ onClose }) => {
  const [balance, setBalance] = useState(0);
  const { account, getBalance } = useAccount();
  const { data: investors } = useGetInvestors();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { createTx, submit } = useTransferTokens();
  const [tx, setTx] = useState<IUnsignedCommand>();
  const [openModal, setOpenModal] = useState(false);

  const { register, control, handleSubmit } = useForm<ITransferTokensProps>({
    values: {
      amount: 0,
      investorFromAccount: account?.address!,
      investorToAccount: '',
    },
  });

  const handleSign = async () => {
    const value = textareaRef.current?.value as unknown as IUnsignedCommand;
    await submit(value);
  };

  const onSubmit = async (data: ITransferTokensProps) => {
    const result = await createTx(data);
    setTx(result);
    setOpenModal(true);
  };

  const filteredInvestors = investors.filter(
    (i) => i.accountName !== account?.address,
  );

  const init = async () => {
    const res = await getBalance();
    setBalance(res);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  if (!account) return;

  return (
    <>
      {openModal && (
        <Dialog
          isOpen
          onOpenChange={() => {
            setOpenModal(false);
          }}
        >
          <DialogHeader>Transaction</DialogHeader>
          <DialogContent>
            <TextareaField
              defaultValue={JSON.stringify(tx, null, 2)}
              ref={textareaRef}
            />
          </DialogContent>
          <DialogFooter>
            <Button onPress={handleSign}>Sign</Button>
          </DialogFooter>
        </Dialog>
      )}
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Transfer Tokens" />
          <RightAsideContent>
            <TextField
              label="Amount"
              type="number"
              {...register('amount', { required: true, max: balance })}
              description={`max amount tokens: ${balance}`}
              errorMessage={`max amount tokens: ${balance}`}
            />

            <Controller
              name="investorToAccount"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="Select an option"
                  items={filteredInvestors}
                  selectedKey={field.value}
                  onSelectionChange={field.onChange}
                >
                  {(item) => (
                    <SelectItem key={item.accountName}>
                      {item.accountName}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
          </RightAsideContent>

          <RightAsideFooter>
            <Button onPress={onClose} variant="transparent">
              Cancel
            </Button>
            <Button type="submit">Transfer</Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
