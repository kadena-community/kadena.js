import { useAccount } from '@/hooks/account';
import { useBatchTransferTokens } from '@/hooks/batchTransferTokens';
import type {
  IBatchTransferTokensProps,
  ITransferToken,
} from '@/services/batchTransferTokens';
import { MonoCheckBox } from '@kadena/kode-icons';
import type { PressEvent } from '@kadena/kode-ui';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Stack,
} from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragNDropCSV } from '../DragNDropCSV/DragNDropCSV';
import { FormatAccount } from '../TableFormatters/FormatAccount';
import { FormatCheckboxForFrozen } from './FormatCheckboxForFrozen';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
}

export interface IRegisterIdentityBatchProps {
  select: string[];
}

export const BatchTransferAssetForm: FC<IProps> = ({ onClose, trigger }) => {
  const { account } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ITransferToken[]>([]);
  const { submit } = useBatchTransferTokens();
  const { handleSubmit } = useForm<IBatchTransferTokensProps>({
    defaultValues: {
      select: [],
    },
  });

  const handleOpen = () => {
    setIsOpen(true);
    if (trigger.props.onPress) trigger.props.onPress();
  };

  const handleOnClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const onSubmit = async () => {
    const d = document.querySelectorAll('#select');

    const filled: string[] = [].filter
      .call(d, function (el: HTMLInputElement) {
        return el.checked;
      })
      .map((el: HTMLInputElement) => el.value);

    const newData = data.filter((d) => filled.indexOf(d.to) > -1);

    const tx = await submit(newData);

    if (!tx) return;
    handleOnClose();
  };

  const handleResult = (data: ITransferToken[]) => {
    if (!account) return;
    setData(data);
  };

  const toggleSelectAll = (evt: PressEvent) => {
    const d = document.querySelectorAll('#select');
    const notSelected = [].filter.call(d, function (el: HTMLInputElement) {
      return el.checked === false;
    });

    const select = !notSelected.length;

    [].forEach.call(d, function (el: HTMLInputElement) {
      el.checked = !select;
    });
  };

  return (
    <>
      {isOpen && (
        <Dialog isOpen={isOpen} onOpenChange={() => setIsOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <DialogHeader>Batch Transfer</DialogHeader>
            <DialogContent>
              <Stack flexDirection="column" width="100%" gap="sm">
                <DragNDropCSV
                  onResult={handleResult}
                  resultSchema={{ to: 'string', amount: 'number' }}
                />

                {data.length > 0 && (
                  <Stack width="100%" flexDirection="column">
                    <Stack>
                      <Button
                        onPress={toggleSelectAll}
                        startVisual={<MonoCheckBox />}
                        isCompact
                        variant="outlined"
                      >
                        Select all
                      </Button>
                    </Stack>
                    <CompactTable
                      fields={[
                        {
                          key: 'to',
                          label: '',
                          width: '20%',
                          render: FormatCheckboxForFrozen({
                            name: 'select',
                          }),
                        },
                        {
                          key: 'to',
                          label: 'To',
                          width: '40%',
                          render: FormatAccount(),
                        },
                        {
                          key: 'amount',
                          label: 'Amount',
                          width: '40%',
                          align: 'end',
                          render: CompactTableFormatters.FormatAmount(),
                        },
                      ]}
                      data={data}
                    />
                  </Stack>
                )}
              </Stack>
            </DialogContent>
            <DialogFooter>
              <Button variant="outlined" onPress={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Transfer
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
