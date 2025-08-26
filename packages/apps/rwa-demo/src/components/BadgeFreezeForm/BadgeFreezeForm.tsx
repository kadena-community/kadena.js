import { useBatchFreezeInvestors } from '@/hooks/batchFreezeInvestors';
import type { IBatchSetAddressFrozenProps } from '@/services/batchSetAddressFrozen';
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Stack,
  TextareaField,
} from '@kadena/kode-ui';

import type { ChangeEvent, FC } from 'react';
import { useEffect, useState } from 'react';
import type { UseFormHandleSubmit, UseFormReset } from 'react-hook-form';

interface IProps {
  type?: 'freeze' | 'unfreeze';
  isDisabled: boolean;
  handleReset: UseFormReset<{
    select: [];
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      select: [];
    },
    undefined
  >;
}

export const BadgeFreezeForm: FC<IProps> = ({
  handleSubmit,
  handleReset,
  isDisabled,
  type,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { submit, isAllowed } = useBatchFreezeInvestors();

  const onSubmit = async ({ select }: { select: string[] }) => {
    const data: IBatchSetAddressFrozenProps = {
      investorAccounts: select,
      pause: type === 'freeze',
      message,
    };

    const tx = await submit(data);
    setIsModalOpen(() => false);
    tx?.listener.subscribe(
      () => {},
      () => {},
      () => {
        handleReset({ select: [] });
      },
    );
  };

  useEffect(() => {
    if (type === 'unfreeze') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleSubmit(onSubmit)();
    }
    if (type === 'freeze') {
      setIsModalOpen(true);
    }
  }, [type]);

  const handleMessageChange = (e: ChangeEvent) => {
    setMessage((e.target as HTMLTextAreaElement).value);
  };

  return (
    <>
      {type === 'freeze' && (
        <Dialog isOpen={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
          <DialogHeader>Freeze selected accounts</DialogHeader>

          <Stack width="100%">
            <TextareaField
              name="message"
              onChange={handleMessageChange}
              label="message"
              maxLength={100}
              rows={5}
            />
          </Stack>

          <DialogFooter>
            <Button variant="outlined" onPress={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              isDisabled={isDisabled || !isAllowed}
              variant="primary"
            >
              Freeze
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
