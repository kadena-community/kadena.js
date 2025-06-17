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
  DialogHeader,
  Notification,
  Stack,
} from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragNDropCSV } from '../DragNDropCSV/DragNDropCSV';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
}

export interface IRegisterIdentityBatchProps {
  select: string[];
}

export const BatchTransferAssetForm: FC<IProps> = ({ onClose, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ITransferToken[]>([]);
  const { submit } = useBatchTransferTokens();
  const {
    handleSubmit,
    formState: { isValid },
  } = useForm<IBatchTransferTokensProps>({
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
          <DialogHeader>Batch Transfer</DialogHeader>
          <DialogContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack flexDirection="column" width="100%" gap="sm">
                <Notification role="status" intent="info">
                  Drag and drop a CSV file with the following schema:
                  <pre>
                    {JSON.stringify(
                      { to: 'string', amount: 'number' },
                      null,
                      2,
                    )}
                  </pre>
                </Notification>
                <DragNDropCSV
                  onResult={handleResult}
                  resultSchema={{ to: 'string', amount: 'number' }}
                />

                {data.length > 0 && (
                  <Stack width="100%" flexDirection="column" gap="sm">
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
                      variant="open"
                      fields={[
                        {
                          key: 'to',
                          label: '',
                          width: '20%',
                          render: CompactTableFormatters.FormatCheckbox({
                            name: 'select',
                          }),
                        },
                        {
                          key: 'to',
                          label: 'To',
                          width: '40%',
                          render: CompactTableFormatters.FormatAccount(),
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
              <Stack
                width="100%"
                flexDirection="row"
                gap="md"
                marginBlockStart="md"
                justifyContent="flex-end"
              >
                <Button variant="outlined" onPress={() => setIsOpen(false)}>
                  Cancel
                </Button>

                <Button isDisabled={!isValid} variant="primary" type="submit">
                  Transfer
                </Button>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
